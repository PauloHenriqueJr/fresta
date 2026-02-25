import 'package:supabase_flutter/supabase_flutter.dart';

import '../../../data/supabase/supabase_client_provider.dart';
import '../domain/profile_model.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

abstract class ProfileRepository {
  Future<ProfileModel?> getProfile(String userId);
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
}

final profileRepositoryProvider = Provider<ProfileRepository>((ref) {
  return SupabaseProfileRepository(ref.watch(supabaseClientProvider));
});
