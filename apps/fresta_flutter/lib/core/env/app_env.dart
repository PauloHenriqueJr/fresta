import 'package:flutter_dotenv/flutter_dotenv.dart';

class AppEnv {
  static String _read(String key, {String fallback = ''}) {
    final fromDotEnv = dotenv.maybeGet(key);
    if (fromDotEnv != null && fromDotEnv.trim().isNotEmpty) return fromDotEnv.trim();

    constFromEnvironment(String _, String fallback) => fallback;
    // Keeps support for --dart-define in CI/automation if needed.
    switch (key) {
      case 'FRESTA_SUPABASE_URL':
        return const String.fromEnvironment('FRESTA_SUPABASE_URL', defaultValue: '');
      case 'FRESTA_SUPABASE_ANON_KEY':
        return const String.fromEnvironment('FRESTA_SUPABASE_ANON_KEY', defaultValue: '');
      case 'FRESTA_PUBLIC_BASE_URL':
        return const String.fromEnvironment(
          'FRESTA_PUBLIC_BASE_URL',
          defaultValue: 'https://fresta.com',
        );
      case 'FRESTA_DEEP_LINK_SCHEME':
        return const String.fromEnvironment('FRESTA_DEEP_LINK_SCHEME', defaultValue: 'fresta');
      case 'FRESTA_DEEP_LINK_AUTH_HOST':
        return const String.fromEnvironment('FRESTA_DEEP_LINK_AUTH_HOST', defaultValue: 'auth');
      case 'FRESTA_GOOGLE_WEB_CLIENT_ID':
        return const String.fromEnvironment('FRESTA_GOOGLE_WEB_CLIENT_ID', defaultValue: '');
      default:
        return constFromEnvironment(key, fallback);
    }
  }

  static String get publicBaseUrl => _read('FRESTA_PUBLIC_BASE_URL', fallback: 'https://fresta.com');
  static String get deepLinkScheme => _read('FRESTA_DEEP_LINK_SCHEME', fallback: 'fresta');
  static String get deepLinkAuthHost => _read('FRESTA_DEEP_LINK_AUTH_HOST', fallback: 'auth');

  static bool get hasSupabaseConfig =>
      _read('FRESTA_SUPABASE_URL').isNotEmpty && _read('FRESTA_SUPABASE_ANON_KEY').isNotEmpty;

  static String get supabaseUrl {
    final value = _read('FRESTA_SUPABASE_URL');
    if (value.isEmpty) {
      throw StateError('FRESTA_SUPABASE_URL não definido (.env ou --dart-define).');
    }
    return value;
  }

  static String get supabaseAnonKey {
    final value = _read('FRESTA_SUPABASE_ANON_KEY');
    if (value.isEmpty) {
      throw StateError('FRESTA_SUPABASE_ANON_KEY não definido (.env ou --dart-define).');
    }
    return value;
  }

  static String get authRedirectUrl => '$deepLinkScheme://$deepLinkAuthHost/callback';

  static String get googleWebClientId => _read('FRESTA_GOOGLE_WEB_CLIENT_ID');
}
