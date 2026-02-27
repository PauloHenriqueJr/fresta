import '../env/app_env.dart';

class FrestaUrls {
  static String calendarShareUrl(String calendarId) {
    final base = AppEnv.publicBaseUrl.replaceAll(RegExp(r'/+$'), '');
    return '$base/c/$calendarId';
  }
}
