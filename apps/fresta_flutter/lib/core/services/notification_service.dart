import 'dart:async';
import 'dart:io';
import 'package:flutter/foundation.dart';
import 'package:flutter_local_notifications/flutter_local_notifications.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:timezone/data/latest_all.dart' as tz;
import 'package:timezone/timezone.dart' as tz;
import 'package:flutter_riverpod/flutter_riverpod.dart';

/// Global navigation callback set by the app router.
/// Called when user taps a notification with a route payload.
typedef NotificationTapCallback = void Function(String route);

class NotificationService {
  static final NotificationService _instance = NotificationService._internal();
  factory NotificationService() => _instance;
  NotificationService._internal();

  final FlutterLocalNotificationsPlugin _plugin = FlutterLocalNotificationsPlugin();
  NotificationTapCallback? onNotificationTap;

  // SharedPreferences keys
  static const _keyDailyReminders = 'notif_daily_reminders';
  static const _keyNewSurprises = 'notif_new_surprises';
  static const _keyMarketing = 'notif_marketing';

  bool _initialized = false;

  Future<void> init() async {
    if (_initialized) return;
    tz.initializeTimeZones();

    const androidSettings = AndroidInitializationSettings('@mipmap/ic_launcher');
    const darwinSettings = DarwinInitializationSettings(
      requestAlertPermission: false, // We'll request explicitly
      requestBadgePermission: true,
      requestSoundPermission: true,
    );

    const settings = InitializationSettings(
      android: androidSettings,
      iOS: darwinSettings,
      macOS: darwinSettings,
    );

    await _plugin.initialize(
      settings: settings,
      onDidReceiveNotificationResponse: _onNotificationResponse,
    );

    _initialized = true;
  }

  /// Request notification permission (Android 13+ and iOS).
  /// Returns true if granted.
  Future<bool> requestPermission() async {
    if (Platform.isAndroid) {
      final android = _plugin.resolvePlatformSpecificImplementation<
          AndroidFlutterLocalNotificationsPlugin>();
      final granted = await android?.requestNotificationsPermission();
      return granted ?? false;
    } else if (Platform.isIOS) {
      final ios = _plugin.resolvePlatformSpecificImplementation<
          IOSFlutterLocalNotificationsPlugin>();
      final granted = await ios?.requestPermissions(alert: true, badge: true, sound: true);
      return granted ?? false;
    }
    return true;
  }

  void _onNotificationResponse(NotificationResponse details) {
    final payload = details.payload;
    if (payload != null && payload.isNotEmpty) {
      debugPrint('[Notification] Tapped with payload: $payload');
      onNotificationTap?.call(payload);
    }
  }

  // ---- Preferences ----

  Future<bool> getDailyRemindersEnabled() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getBool(_keyDailyReminders) ?? true;
  }

  Future<void> setDailyRemindersEnabled(bool enabled) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setBool(_keyDailyReminders, enabled);
  }

  Future<bool> getNewSurprisesEnabled() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getBool(_keyNewSurprises) ?? true;
  }

  Future<void> setNewSurprisesEnabled(bool enabled) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setBool(_keyNewSurprises, enabled);
  }

  Future<bool> getMarketingEnabled() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getBool(_keyMarketing) ?? false;
  }

  Future<void> setMarketingEnabled(bool enabled) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setBool(_keyMarketing, enabled);
  }

  // ---- Scheduling ----

  Future<void> scheduleDailyReminder({
    required int id,
    required String title,
    required String body,
    required int hour,
    required int minute,
    String? payload,
  }) async {
    final enabled = await getDailyRemindersEnabled();
    if (!enabled) return;

    await _plugin.zonedSchedule(
      id: id,
      title: title,
      body: body,
      scheduledDate: _nextInstanceOfTime(hour, minute),
      notificationDetails: const NotificationDetails(
        android: AndroidNotificationDetails(
          'daily_reminders',
          'Lembretes Diários',
          channelDescription: 'Lembretes para abrir sua surpresa do dia.',
          importance: Importance.max,
          priority: Priority.high,
          icon: '@mipmap/ic_launcher',
        ),
        iOS: DarwinNotificationDetails(
          presentAlert: true,
          presentBadge: true,
          presentSound: true,
        ),
      ),
      androidScheduleMode: AndroidScheduleMode.exactAllowWhileIdle,
      matchDateTimeComponents: DateTimeComponents.time,
      payload: payload,
    );
  }

  Future<void> scheduleCalendarReminder({
    required String calendarId,
    required String title,
  }) async {
    final int notificationId = calendarId.hashCode.abs() % 100000;

    await scheduleDailyReminder(
      id: notificationId,
      title: 'Fresta: Hora da surpresa! 🎁',
      body: 'Abra seu calendário "$title" para ver o dia de hoje.',
      hour: 9,
      minute: 0,
      payload: '/c/$calendarId',
    );
  }

  Future<void> cancelCalendarReminder(String calendarId) async {
    final int notificationId = calendarId.hashCode.abs() % 100000;
    await _plugin.cancel(id: notificationId);
  }

  /// Schedule a one-time notification for when a specific day unlocks.
  /// Uses a unique ID derived from calendarId + dayNumber.
  Future<void> scheduleDayUnlockReminder({
    required String calendarId,
    required String calendarTitle,
    required int dayNumber,
    required DateTime unlockDate,
  }) async {
    final int notificationId =
        ('${calendarId}_day_$dayNumber'.hashCode.abs()) % 100000 + 100000;

    // Schedule for 9:00 AM on the unlock date
    final scheduledDate = tz.TZDateTime(
      tz.local,
      unlockDate.year,
      unlockDate.month,
      unlockDate.day,
      9,
      0,
    );

    // Don't schedule if the date is already in the past
    if (scheduledDate.isBefore(tz.TZDateTime.now(tz.local))) return;

    await _plugin.zonedSchedule(
      id: notificationId,
      title: 'Fresta: Porta $dayNumber abriu! 🎉',
      body: 'A surpresa do dia $dayNumber de "$calendarTitle" está pronta!',
      scheduledDate: scheduledDate,
      notificationDetails: const NotificationDetails(
        android: AndroidNotificationDetails(
          'day_unlock',
          'Portas Desbloqueadas',
          channelDescription: 'Aviso quando uma porta específica é desbloqueada.',
          importance: Importance.max,
          priority: Priority.high,
          icon: '@mipmap/ic_launcher',
        ),
        iOS: DarwinNotificationDetails(
          presentAlert: true,
          presentBadge: true,
          presentSound: true,
        ),
      ),
      androidScheduleMode: AndroidScheduleMode.exactAllowWhileIdle,
      payload: '/c/$calendarId',
    );
  }

  tz.TZDateTime _nextInstanceOfTime(int hour, int minute) {
    final tz.TZDateTime now = tz.TZDateTime.now(tz.local);
    tz.TZDateTime scheduledDate =
        tz.TZDateTime(tz.local, now.year, now.month, now.day, hour, minute);
    if (scheduledDate.isBefore(now)) {
      scheduledDate = scheduledDate.add(const Duration(days: 1));
    }
    return scheduledDate;
  }

  Future<void> cancelAll() async {
    await _plugin.cancelAll();
  }
}

final notificationServiceProvider = Provider<NotificationService>((ref) {
  return NotificationService(); // Singleton via factory
});
