DROP DATABASE express_gallery;
DROP USER express_gallery_user;

CREATE USER express_gallery_user;
PASSWORD 'password';
CREATE DATABASE express_gallery; WITH OWNER express_gallery_user; 