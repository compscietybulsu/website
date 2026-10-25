-- Partner logos: add Still Life Photography and Developer Camp, remove Bulacan State University. Safe to re-run.
DELETE FROM partners WHERE name = 'Bulacan State University';
INSERT INTO partners (id,name,detail,image) SELECT 'a3c6f1e2-5b7d-4c1a-9e8f-2d4b6a8c0e13','Still Life Photography','','/partners/still-life-photography.png' WHERE NOT EXISTS (SELECT 1 FROM partners WHERE name = 'Still Life Photography');
INSERT INTO partners (id,name,detail,image) SELECT 'b7d2e9a4-1c3f-4e6b-8a5d-7f9c1e3b5d24','Developer Camp','','/partners/developer-camp.jpg' WHERE NOT EXISTS (SELECT 1 FROM partners WHERE name = 'Developer Camp');
