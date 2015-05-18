// DELETE Admins with duplicate usernames

MATCH (a:Admin)
WITH a.username AS username, collect(a) AS nodes
WHERE size(nodes) > 1
FOREACH (a in tail(nodes) | DELETE a)