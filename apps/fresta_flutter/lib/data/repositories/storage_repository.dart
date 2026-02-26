import 'dart:io';
import 'dart:typed_data';

import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:supabase_flutter/supabase_flutter.dart';

import '../supabase/supabase_client_provider.dart';

/// Repository for uploading/deleting files in Supabase Storage.
class StorageRepository {
  StorageRepository(this._client);

  final SupabaseClient _client;

  static const _dayMediaBucket = 'day-media';

  /// Uploads an image for a calendar day.
  ///
  /// Path convention: `{userId}/{calendarId}/dia-{day}.jpg`
  /// Returns the public URL of the uploaded image.
  Future<String> uploadDayImage({
    required String userId,
    required String calendarId,
    required int day,
    required File file,
  }) async {
    final ext = file.path.split('.').last.toLowerCase();
    final validExt = ['jpg', 'jpeg', 'png', 'webp', 'gif'].contains(ext) ? ext : 'jpg';
    final path = '$userId/$calendarId/dia-$day.$validExt';

    // Read bytes for upload
    final bytes = await file.readAsBytes();

    await _client.storage.from(_dayMediaBucket).uploadBinary(
      path,
      bytes,
      fileOptions: FileOptions(
        upsert: true,
        contentType: 'image/$validExt',
      ),
    );

    // Return the public URL
    final publicUrl = _client.storage.from(_dayMediaBucket).getPublicUrl(path);
    return publicUrl;
  }

  /// Uploads raw bytes (for compressed images).
  Future<String> uploadDayImageBytes({
    required String userId,
    required String calendarId,
    required int day,
    required Uint8List bytes,
    String extension = 'jpg',
  }) async {
    final path = '$userId/$calendarId/dia-$day.$extension';

    await _client.storage.from(_dayMediaBucket).uploadBinary(
      path,
      bytes,
      fileOptions: FileOptions(
        upsert: true,
        contentType: 'image/$extension',
      ),
    );

    return _client.storage.from(_dayMediaBucket).getPublicUrl(path);
  }

  /// Deletes an uploaded day image.
  Future<void> deleteDayImage({
    required String userId,
    required String calendarId,
    required int day,
    String extension = 'jpg',
  }) async {
    final path = '$userId/$calendarId/dia-$day.$extension';
    await _client.storage.from(_dayMediaBucket).remove([path]);
  }
}

final storageRepositoryProvider = Provider<StorageRepository>((ref) {
  return StorageRepository(ref.watch(supabaseClientProvider));
});
