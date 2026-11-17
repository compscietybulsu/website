-- Partner logos: add Silid Malolos, remove Bulacan State University. Safe to re-run.
DELETE FROM partners WHERE name = 'Bulacan State University';
INSERT INTO partners (id,name,detail,image) SELECT '58e86a60-03ae-47bd-b4ae-0c1a54d39cde','Silid Malolos','','/partners/silid-malolos.jpg' WHERE NOT EXISTS (SELECT 1 FROM partners WHERE name = 'Silid Malolos');
