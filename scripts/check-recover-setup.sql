-- Diagnostic script to check recover setup

-- 1. Check if 'recover' category exists
SELECT 'Categories Table:' as info;
SELECT id, name FROM categories WHERE name IN ('strengthen', 'recover', 'mobilise', 'warm-up');

-- 2. Check user_day_assignments structure
SELECT 'User Day Assignments Columns:' as info;
SELECT column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_name = 'user_day_assignments'
ORDER BY ordinal_position;

-- 3. Check if there are any recover assignments
SELECT 'Recover Day Assignments:' as info;
SELECT 
    uda.user_id,
    uda.day_id,
    uda.category_id,
    c.name as category_name,
    uda.image_url
FROM user_day_assignments uda
JOIN categories c ON uda.category_id = c.id
WHERE c.name = 'recover'
LIMIT 10;

-- 4. Check if there are any strengthen assignments (for comparison)
SELECT 'Strengthen Day Assignments:' as info;
SELECT 
    uda.user_id,
    uda.day_id,
    uda.category_id,
    c.name as category_name,
    uda.image_url
FROM user_day_assignments uda
JOIN categories c ON uda.category_id = c.id
WHERE c.name = 'strengthen'
LIMIT 10;

-- 5. Check if there are recover exercises
SELECT 'Recover Exercises Count:' as info;
SELECT COUNT(*) as count
FROM exercises e
JOIN categories c ON e.category_id = c.id
WHERE c.name = 'recover';

-- 6. Sample recover exercises
SELECT 'Sample Recover Exercises:' as info;
SELECT 
    e.id,
    e.name,
    c.name as category
FROM exercises e
JOIN categories c ON e.category_id = c.id
WHERE c.name = 'recover'
LIMIT 5;