-- Partner logos: add Silid Malolos, DICT Region 3 and Student Meal · Pinoy Food & Sizzling, remove Bulacan State University. Safe to re-run.
DELETE FROM partners WHERE name = 'Bulacan State University';
INSERT INTO partners (id,name,detail,image) SELECT '58e86a60-03ae-47bd-b4ae-0c1a54d39cde','Silid Malolos','','/partners/silid-malolos.jpg' WHERE NOT EXISTS (SELECT 1 FROM partners WHERE name = 'Silid Malolos');
INSERT INTO partners (id,name,detail,image) SELECT 'd1cc159d-bdf9-400e-98d6-f70edf05fbb7','DICT Region 3','','/partners/dict-region-3.jpg' WHERE NOT EXISTS (SELECT 1 FROM partners WHERE name = 'DICT Region 3');
INSERT INTO partners (id,name,detail,image) SELECT '94ca73ee-e7f4-4606-bde1-17b1b851c5e1','Student Meal · Pinoy Food & Sizzling','','/partners/student-meal-sizzling.jpg' WHERE NOT EXISTS (SELECT 1 FROM partners WHERE name = 'Student Meal · Pinoy Food & Sizzling');
