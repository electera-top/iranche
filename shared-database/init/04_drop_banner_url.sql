USE shop_management;

-- Drop old banner_url column (ignore error if it doesn't exist)
ALTER TABLE themes DROP COLUMN banner_url;


