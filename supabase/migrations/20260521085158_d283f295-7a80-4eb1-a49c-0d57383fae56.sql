REVOKE EXECUTE ON FUNCTION public.redeem_reward(TEXT, INTEGER) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.redeem_reward(TEXT, INTEGER) TO authenticated;