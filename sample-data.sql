-- ====================================
-- DATOS DE EJEMPLO PARA TU MANGA
-- ====================================
-- Pega esto en el SQL Editor de Supabase DESPUÉS de haber corrido auth-setup.sql

-- 1. AGREGAR OBRAS DE EJEMPLO
INSERT INTO public.manga_works (
  id,
  title,
  synopsis,
  cover_url,
  work_type,
  status,
  tags,
  author,
  read_count,
  likes_count,
  created_at
) VALUES
(
  '550e8400-e29b-41d4-a716-446655440001',
  'El Poder del Destino',
  'Un joven descubre que tiene poderes extraordinarios. Junto a sus amigos, debe salvar el mundo de una amenaza oscura.',
  'https://via.placeholder.com/400x520?text=El+Poder+del+Destino',
  'MANGA',
  'finalizado',
  ARRAY['Acción', 'Aventura', 'Fantasía'],
  'richardalexanderdiaz0@gmail.com',
  142,
  87,
  NOW()
),
(
  '550e8400-e29b-41d4-a716-446655440002',
  'Corazones Prohibidos',
  'Una historia de romance entre dos personas de mundos completamente diferentes que deben superar todos los obstáculos.',
  'https://via.placeholder.com/400x520?text=Corazones+Prohibidos',
  'MANHWA',
  'en emisión',
  ARRAY['Romance', 'Drama', 'Vida escolar'],
  'richardalexanderdiaz0@gmail.com',
  256,
  193,
  NOW() - INTERVAL '5 days'
),
(
  '550e8400-e29b-41d4-a716-446655440003',
  'La Sombra del Pasado',
  'Un detective debe resolver un caso que lo conecta con su pasado más oscuro. Cada pista lo acerca a la verdad.',
  'https://via.placeholder.com/400x520?text=La+Sombra+del+Pasado',
  'COMIC',
  'finalizado',
  ARRAY['Suspenso', 'Drama', '+18'],
  'richardalexanderdiaz0@gmail.com',
  89,
  56,
  NOW() - INTERVAL '10 days'
),
(
  '550e8400-e29b-41d4-a716-446655440004',
  'Academia de Magia',
  'Un mundo secreto de magia existe entre nosotros. Los estudiantes deben aprender a controlar sus poderes.',
  'https://via.placeholder.com/400x520?text=Academia+de+Magia',
  'MANGA',
  'en emisión',
  ARRAY['Fantasía', 'Vida escolar', 'Acción'],
  'richardalexanderdiaz0@gmail.com',
  312,
  241,
  NOW() - INTERVAL '1 day'
);

-- 2. AGREGAR CAPÍTULOS DE EJEMPLO
INSERT INTO public.manga_chapters (
  id,
  manga_work_id,
  chapter_number,
  cover_url,
  pages,
  created_at
) VALUES
(
  '660e8400-e29b-41d4-a716-446655440001',
  '550e8400-e29b-41d4-a716-446655440001',
  '1',
  'https://via.placeholder.com/400x520?text=Capítulo+1',
  ARRAY[
    'https://via.placeholder.com/800x1000?text=Página+1',
    'https://via.placeholder.com/800x1000?text=Página+2',
    'https://via.placeholder.com/800x1000?text=Página+3'
  ]::JSONB,
  NOW()
),
(
  '660e8400-e29b-41d4-a716-446655440002',
  '550e8400-e29b-41d4-a716-446655440001',
  '2',
  'https://via.placeholder.com/400x520?text=Capítulo+2',
  ARRAY[
    'https://via.placeholder.com/800x1000?text=Página+1',
    'https://via.placeholder.com/800x1000?text=Página+2'
  ]::JSONB,
  NOW()
),
(
  '660e8400-e29b-41d4-a716-446655440003',
  '550e8400-e29b-41d4-a716-446655440002',
  '1',
  'https://via.placeholder.com/400x520?text=Capítulo+1',
  ARRAY[
    'https://via.placeholder.com/800x1000?text=Página+1',
    'https://via.placeholder.com/800x1000?text=Página+2',
    'https://via.placeholder.com/800x1000?text=Página+3',
    'https://via.placeholder.com/800x1000?text=Página+4'
  ]::JSONB,
  NOW()
),
(
  '660e8400-e29b-41d4-a716-446655440004',
  '550e8400-e29b-41d4-a716-446655440003',
  '1',
  'https://via.placeholder.com/400x520?text=Capítulo+1',
  ARRAY[
    'https://via.placeholder.com/800x1000?text=Página+1',
    'https://via.placeholder.com/800x1000?text=Página+2'
  ]::JSONB,
  NOW()
),
(
  '660e8400-e29b-41d4-a716-446655440005',
  '550e8400-e29b-41d4-a716-446655440004',
  '1',
  'https://via.placeholder.com/400x520?text=Capítulo+1',
  ARRAY[
    'https://via.placeholder.com/800x1000?text=Página+1',
    'https://via.placeholder.com/800x1000?text=Página+2',
    'https://via.placeholder.com/800x1000?text=Página+3'
  ]::JSONB,
  NOW()
);

-- ¡LISTO! Ahora deberías ver las 4 obras en tu app.
SELECT 'Datos de ejemplo insertados correctamente!' as status;
