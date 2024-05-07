CREATE TRIGGER create_user_on_signup AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION create_users_for_new_signup_user();


