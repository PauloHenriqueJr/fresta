class CalendarSummary {
  const CalendarSummary({
    required this.id,
    required this.title,
    required this.themeId,
    required this.status,
    required this.privacy,
    required this.duration,
    required this.createdAt,
    required this.isPremium,
  });

  final String id;
  final String title;
  final String themeId;
  final String status;
  final String privacy;
  final int duration;
  final DateTime? createdAt;
  final bool isPremium;

  factory CalendarSummary.fromMap(Map<String, dynamic> map) {
    return CalendarSummary(
      id: map['id'] as String,
      title: (map['title'] as String?) ?? 'Calendário',
      themeId: (map['theme_id'] as String?) ?? 'aniversario',
      status: (map['status'] as String?) ?? 'rascunho',
      privacy: (map['privacy'] as String?) ?? 'private',
      duration: (map['duration'] as int?) ?? 24,
      createdAt: map['created_at'] != null
          ? DateTime.tryParse(map['created_at'] as String)
          : null,
      isPremium: (map['is_premium'] as bool?) ?? false,
    );
  }
}

class CalendarDayModel {
  const CalendarDayModel({
    required this.id,
    required this.calendarId,
    required this.day,
    this.contentType,
    this.message,
    this.url,
    this.label,
    this.openedCount = 0,
  });

  final String id;
  final String calendarId;
  final int day;
  final String? contentType;
  final String? message;
  final String? url;
  final String? label;
  final int openedCount;

  factory CalendarDayModel.fromMap(Map<String, dynamic> map) {
    return CalendarDayModel(
      id: map['id'] as String,
      calendarId: map['calendar_id'] as String,
      day: (map['day'] as int?) ?? 0,
      contentType: map['content_type'] as String?,
      message: map['message'] as String?,
      url: map['url'] as String?,
      label: map['label'] as String?,
      openedCount: (map['opened_count'] as int?) ?? 0,
    );
  }

  CalendarDayModel copyWith({
    String? contentType,
    String? message,
    String? url,
    String? label,
  }) {
    return CalendarDayModel(
      id: id,
      calendarId: calendarId,
      day: day,
      contentType: contentType ?? this.contentType,
      message: message ?? this.message,
      url: url ?? this.url,
      label: label ?? this.label,
      openedCount: openedCount,
    );
  }
}

class CalendarDetailModel {
  const CalendarDetailModel({
    required this.calendar,
    required this.days,
    this.hasPassword = false,
  });

  final CalendarSummary calendar;
  final List<CalendarDayModel> days;
  final bool hasPassword;
}
