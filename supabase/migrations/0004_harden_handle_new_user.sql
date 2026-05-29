-- 0004 — Durcissement sécurité (signalé par l'analyseur Supabase).
-- handle_new_user() est une fonction SECURITY DEFINER qui sert uniquement de trigger
-- sur auth.users. Elle n'a aucune raison d'être appelable via l'API REST (/rpc/),
-- donc on retire EXECUTE aux rôles anon et authenticated. Le trigger continue de marcher.
revoke execute on function public.handle_new_user() from anon, authenticated;
