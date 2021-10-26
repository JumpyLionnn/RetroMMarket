do
$do$
declare
     i int;
begin
for  i in 1..100
loop
    INSERT INTO invitationTokens (token) VALUES (substr(md5(random()::text), 0, 7));
end loop;
end;
$do$;
SELECT token FROM invitationTokens WHERE used = false;