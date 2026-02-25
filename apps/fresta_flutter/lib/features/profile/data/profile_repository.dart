import 'package:supabase_flutter/supabase_flutter.dart';

import '../../../data/supabase/supabase_client_provider.dart';
import '../domain/profile_model.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

abstract class ProfileRepository {
  Future<ProfileModel?> getProfile(String userId);
  Future<void> updateProfile(ProfileModel profile);
}

class SupabaseProfileRepository implements ProfileRepository {
  SupabaseProfileRepository(this._client);

  final SupabaseClient _client;

  @override
  Future<ProfileModel?> getProfile(String userId) async {
    final result = await _client
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();
    if (result == null) return null;
    return ProfileModel.fromMap(Map<String, dynamic>.from(result));
  }

  @override
  Future<void> updateProfile(ProfileModel profile) async {
    await _client.from('profiles').update({
      if (profile.displayName != null) 'display_name': profile.displayName,
      if (profile.avatar != null) 'avatar': profile.avatar,
      if (profile.themePreference != null) 'theme_preference': profile.themePreference,
      'onboarding_completed': profile.onboardingCompleted,
      if (profile.role != null) 'role': profile.role,
    }).eq('id', profile.id);
  }
}

final profileRepositoryProvider = Provider<ProfileRepository>((ref) {
  return SupabaseProfileRepository(ref.watch(supabaseClientProvider));
});
