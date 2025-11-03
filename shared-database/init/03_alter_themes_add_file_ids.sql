USE shop_management;

-- Add file id columns if they are missing (may error if already exist)
ALTER TABLE themes ADD COLUMN banner_file_id INT NULL;
ALTER TABLE themes ADD COLUMN zip_file_id INT NULL;

-- Optional indexes
CREATE INDEX idx_banner_file_id ON themes (banner_file_id);
CREATE INDEX idx_zip_file_id ON themes (zip_file_id);

