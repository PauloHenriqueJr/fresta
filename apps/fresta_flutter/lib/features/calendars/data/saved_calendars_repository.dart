import 'dart:convert';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:shared_preferences/shared_preferences.dart';

class SavedCalendar {
  final String id;
  final String title;
  final String? emoji;
  final DateTime savedAt;

  SavedCalendar({
    required this.id,
    required this.title,
    this.emoji,
    required this.savedAt,
  });

  Map<String, dynamic> toMap() {
    return {
      'id': id,
      'title': title,
      'emoji': emoji,
      'savedAt': savedAt.toIso8601String(),
    };
  }

  factory SavedCalendar.fromMap(Map<String, dynamic> map) {
    return SavedCalendar(
      id: map['id'] as String,
      title: map['title'] as String,
      emoji: map['emoji'] as String?,
      savedAt: DateTime.parse(map['savedAt'] as String),
    );
  }
}

class SavedCalendarsRepository {
  static const _key = 'fresta_saved_calendars';

  Future<List<SavedCalendar>> getSavedCalendars() async {
    final prefs = await SharedPreferences.getInstance();
    final list = prefs.getStringList(_key) ?? [];
    return list.map((e) => SavedCalendar.fromMap(jsonDecode(e))).toList()
      ..sort((a, b) => b.savedAt.compareTo(a.savedAt));
  }

  Future<void> saveCalendar(SavedCalendar calendar) async {
    final prefs = await SharedPreferences.getInstance();
    final current = await getSavedCalendars();
    
    // Remove if already exists to update order
    final updated = current.where((e) => e.id != calendar.id).toList();
    updated.insert(0, calendar);

    // Limit to 20 for now
    if (updated.length > 20) {
      updated.removeRange(20, updated.length);
    }

    await prefs.setStringList(
      _key,
      updated.map((e) => jsonEncode(e.toMap())).toList(),
    );
  }

  Future<void> removeCalendar(String id) async {
    final prefs = await SharedPreferences.getInstance();
    final current = await getSavedCalendars();
    final updated = current.where((e) => e.id != id).toList();

    await prefs.setStringList(
      _key,
      updated.map((e) => jsonEncode(e.toMap())).toList(),
    );
  }
}

final savedCalendarsRepositoryProvider = Provider<SavedCalendarsRepository>((ref) {
  return SavedCalendarsRepository();
});

final savedCalendarsProvider = FutureProvider<List<SavedCalendar>>((ref) async {
  return ref.watch(savedCalendarsRepositoryProvider).getSavedCalendars();
});
