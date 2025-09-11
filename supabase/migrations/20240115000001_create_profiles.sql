-- Create a function to handle user profile creation and language preferences
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, user_id, username, full_name, avatar_url, languages_spoken, learning_languages)
  values (
    uuid_generate_v4(),
    new.id,
    coalesce(new.raw_user_meta_data->>'username', new.email),
    coalesce(new.raw_user_meta_data->>'full_name', new.email),
    coalesce(new.raw_user_meta_data->>'avatar_url', ''),
    '{}',
    jsonb_build_object('base', '', 'target', '')
  );
  return new;
end;
$$ language plpgsql security definer;

-- Set up trigger to create profile on new user signup
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Create a function to update user language preferences
create or replace function update_user_languages(
  user_id uuid,
  base_lang text,
  target_lang text,
  spoken_langs text[]
)
returns json
language plpgsql
security definer
set search_path = public
as $$
declare
  profile_record profiles;
begin
  -- Update the profile with new language preferences
  update profiles
  set 
    languages_spoken = spoken_langs,
    learning_languages = jsonb_build_object('base', base_lang, 'target', target_lang),
    updated_at = now()
  where profiles.user_id = update_user_languages.user_id
  returning * into profile_record;

  -- Also ensure there's a progress record for this language combination
  insert into user_progress (
    user_id,
    target_language,
    total_points,
    vocabulary_stages_completed,
    quiz_stages_completed,
    streak_days,
    last_activity_date
  )
  values (
    user_id,
    target_lang,
    0,
    '{}',
    '{}',
    0,
    now()
  )
  on conflict (user_id, target_language) do nothing;

  return row_to_json(profile_record);
end;
$$;
