DROP DATABASE express_gallery;
DROP USER express_gallery_user;

CREATE USER express_gallery_user WITH ENCRYPTED PASSWORD 'password';
CREATE DATABASE express_gallery WITH OWNER express_gallery_user; 
