-- ======================================
-- AUTH SUPABASE - ROLES Y POLÍTICAS
-- ======================================

-- 1. CREAR TABLA DE USUARIOS CON ROL DE ADMIN
CREATE TABLE IF NOT EXISTS public.user_roles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  is_admin BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar RLS para user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Política: todos pueden ver sus propios roles
CREATE POLICY "Users can view their own role"
  ON public.user_roles FOR SELECT
  USING (auth.uid() = id);

-- Política: solo administrador puede actualizar roles
CREATE POLICY "Admin can update roles"
  ON public.user_roles FOR UPDATE
  USING (auth.uid() IN (SELECT id FROM public.user_roles WHERE is_admin = TRUE))
  WITH CHECK (auth.uid() IN (SELECT id FROM public.user_roles WHERE is_admin = TRUE));

-- 2. CREAR TABLA DE PERFIL DE USUARIO
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE,
  username TEXT UNIQUE,
  avatar_url TEXT,
  bio TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar RLS para user_profiles
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- Política: todos pueden leer perfiles públicos
CREATE POLICY "Public profiles are viewable by everyone"
  ON public.user_profiles FOR SELECT
  USING (TRUE);

-- Política: usuarios pueden actualizar su propio perfil
CREATE POLICY "Users can update their own profile"
  ON public.user_profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Política: usuarios pueden insertar su propio perfil
CREATE POLICY "Users can insert their own profile"
  ON public.user_profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- 3. CREAR FUNCIÓN PARA CREAR PERFIL EN AUTH.USERS
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER
AS $$
DECLARE
  admin_email TEXT := 'richardalexanderdiaz0@gmail.com';
BEGIN
  -- Insertar en user_profiles
  INSERT INTO public.user_profiles (id, email, username, created_at, updated_at)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'username', SPLIT_PART(NEW.email, '@', 1)),
    NOW(),
    NOW()
  );

  -- Insertar en user_roles
  INSERT INTO public.user_roles (id, is_admin, created_at)
  VALUES (
    NEW.id,
    NEW.email = admin_email,
    NOW()
  );

  RETURN NEW;
END;
$$;

-- 4. TRIGGER PARA CREAR PERFIL CUANDO SE REGISTRA NUEVO USUARIO
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 5. CREAR TABLA DE OBRAS PRINCIPAL
CREATE TABLE IF NOT EXISTS public.manga_works (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  synopsis TEXT,
  cover_url TEXT,
  work_type TEXT,
  status TEXT,
  scheduled_at TIMESTAMP WITH TIME ZONE,
  tags TEXT[],
  author TEXT,
  admin_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  read_count INTEGER DEFAULT 0,
  likes_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.manga_works ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read works"
  ON public.manga_works FOR SELECT
  USING (TRUE);

CREATE POLICY "Admins can insert works"
  ON public.manga_works FOR INSERT
  WITH CHECK (auth.uid() IN (SELECT id FROM public.user_roles WHERE is_admin = TRUE));

CREATE POLICY "Admins can update their own works"
  ON public.manga_works FOR UPDATE
  USING (
    auth.uid() IN (SELECT id FROM public.user_roles WHERE is_admin = TRUE)
    AND admin_user_id = auth.uid()
  )
  WITH CHECK (
    auth.uid() IN (SELECT id FROM public.user_roles WHERE is_admin = TRUE)
    AND admin_user_id = auth.uid()
  );

-- 6. CREAR TABLA DE CAPÍTULOS
CREATE TABLE IF NOT EXISTS public.manga_chapters (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  manga_work_id UUID REFERENCES public.manga_works(id) ON DELETE CASCADE NOT NULL,
  chapter_number TEXT NOT NULL,
  cover_url TEXT,
  pages JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.manga_chapters ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read chapters"
  ON public.manga_chapters FOR SELECT
  USING (TRUE);

CREATE POLICY "Admins can insert chapters"
  ON public.manga_chapters FOR INSERT
  WITH CHECK (auth.uid() IN (SELECT id FROM public.user_roles WHERE is_admin = TRUE));

CREATE POLICY "Admins can update chapters"
  ON public.manga_chapters FOR UPDATE
  USING (auth.uid() IN (SELECT id FROM public.user_roles WHERE is_admin = TRUE))
  WITH CHECK (auth.uid() IN (SELECT id FROM public.user_roles WHERE is_admin = TRUE));

-- 7. CREAR TABLA DE COMENTARIOS DE OBRAS
CREATE TABLE IF NOT EXISTS public.manga_comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  manga_work_id UUID REFERENCES public.manga_works(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  likes_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar RLS para manga_comments
ALTER TABLE public.manga_comments ENABLE ROW LEVEL SECURITY;

-- Política: todos pueden leer comentarios
CREATE POLICY "Public comments are viewable"
  ON public.manga_comments FOR SELECT
  USING (TRUE);

-- Política: usuarios autenticados pueden crear comentarios
CREATE POLICY "Authenticated users can insert comments"
  ON public.manga_comments FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL AND auth.uid() = user_id);

-- Política: usuarios pueden actualizar sus propios comentarios
CREATE POLICY "Users can update their own comments"
  ON public.manga_comments FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- 6. CREAR TABLA DE REPORTES DE OBRAS
CREATE TABLE IF NOT EXISTS public.manga_reports (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  manga_work_id UUID REFERENCES public.manga_works(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  reason TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'closed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar RLS para manga_reports
ALTER TABLE public.manga_reports ENABLE ROW LEVEL SECURITY;

-- Política: solo admin puede ver reportes
CREATE POLICY "Admins can view reports"
  ON public.manga_reports FOR SELECT
  USING (auth.uid() IN (SELECT id FROM public.user_roles WHERE is_admin = TRUE));

-- Política: usuarios pueden crear reportes
CREATE POLICY "Users can create reports"
  ON public.manga_reports FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- 7. CREAR TABLA DE CAPÍTULOS LEÍDOS POR USUARIO
CREATE TABLE IF NOT EXISTS public.user_chapter_reads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  manga_chapter_id UUID REFERENCES public.manga_chapters(id) ON DELETE CASCADE NOT NULL,
  read_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, manga_chapter_id)
);

-- Habilitar RLS para user_chapter_reads
ALTER TABLE public.user_chapter_reads ENABLE ROW LEVEL SECURITY;

-- Política: usuarios pueden ver sus propias lecturas
CREATE POLICY "Users can view their own reads"
  ON public.user_chapter_reads FOR SELECT
  USING (auth.uid() = user_id);

-- Política: usuarios pueden insertar sus propias lecturas
CREATE POLICY "Users can insert their own reads"
  ON public.user_chapter_reads FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- 8. ACTUALIZAR TABLA manga_works CON USUARIO ADMIN
ALTER TABLE IF EXISTS public.manga_works 
ADD COLUMN IF NOT EXISTS admin_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;

-- Las políticas de manga_works y manga_chapters ya se definen en los bloques anteriores.

-- 10. TABLA DE NOTIFICACIONES
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL,
  title TEXT,
  message TEXT,
  manga_work_id UUID REFERENCES public.manga_works(id) ON DELETE CASCADE,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own notifications"
  ON public.notifications FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications"
  ON public.notifications FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ======================================
-- ÍNDICES PARA OPTIMIZACIÓN
-- ======================================
CREATE INDEX idx_user_profiles_email ON public.user_profiles(email);
CREATE INDEX idx_manga_works_admin_user ON public.manga_works(admin_user_id);
CREATE INDEX idx_manga_comments_work ON public.manga_comments(manga_work_id);
CREATE INDEX idx_manga_comments_user ON public.manga_comments(user_id);
CREATE INDEX idx_manga_reports_work ON public.manga_reports(manga_work_id);
CREATE INDEX idx_user_chapter_reads_user ON public.user_chapter_reads(user_id);
CREATE INDEX idx_notifications_user ON public.notifications(user_id);

-- ======================================
-- MOSTRAR ESTADO
-- ======================================
SELECT 'Auth setup completed successfully!' as status;
