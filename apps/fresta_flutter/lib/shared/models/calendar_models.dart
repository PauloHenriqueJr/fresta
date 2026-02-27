class CalendarSummary {
  const CalendarSummary({
    required this.id,
    required this.title,
    this.ownerId,
    this.headerMessage,
    this.footerMessage,
    required this.themeId,
    required this.status,
    required this.privacy,
    required this.duration,
    required this.createdAt,
    required this.isPremium,
    this.startDate,
    this.views = 0,
    this.likes = 0,
  });

  final String id;
  final String title;
  final String? ownerId;
  final String? headerMessage;
  final String? footerMessage;
  final String themeId;
  final String status;
  final String privacy;
  final int duration;
  final DateTime? createdAt;
  final bool isPremium;
  final DateTime? startDate;
  final int views;
  final int likes;

  factory CalendarSummary.fromMap(Map<String, dynamic> map) {
    return CalendarSummary(
      id: map['id'] as String,
      title: (map['title'] as String?) ?? 'Calendário',
      ownerId: map['owner_id'] as String?,
      headerMessage: map['header_message'] as String?,
      footerMessage: map['footer_message'] as String?,
      themeId: (map['theme_id'] as String?) ?? 'aniversario',
      status: (map['status'] as String?) ?? 'rascunho',
      privacy: (map['privacy'] as String?) ?? 'private',
      duration: (map['duration'] as int?) ?? 24,
      createdAt: map['created_at'] != null
          ? DateTime.tryParse(map['created_at'] as String)
          : null,
      isPremium: (map['is_premium'] as bool?) ?? false,
      startDate: map['start_date'] != null
          ? DateTime.tryParse(map['start_date'] as String)
          : null,
      views: (map['views'] as int?) ?? 0,
      likes: (map['likes'] as int?) ?? 0,
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

class ThemeDefaults {
  final String themeId;
  final String defaultTitle;
  final String? defaultHeaderMessage;
  final String? defaultFooterMessage;
  final String? defaultCapsuleTitle;
  final String? defaultCapsuleMessage;
  final String? defaultLockedTitle;
  final String? defaultLockedMessage;

  ThemeDefaults({
    required this.themeId,
    required this.defaultTitle,
    this.defaultHeaderMessage,
    this.defaultFooterMessage,
    this.defaultCapsuleTitle,
    this.defaultCapsuleMessage,
    this.defaultLockedTitle,
    this.defaultLockedMessage,
  });

  factory ThemeDefaults.fromMap(Map<String, dynamic> map) {
    return ThemeDefaults(
      themeId: map['theme_id'] as String,
      defaultTitle: map['default_title'] as String,
      defaultHeaderMessage: map['default_header_message'] as String?,
      defaultFooterMessage: map['default_footer_message'] as String?,
      defaultCapsuleTitle: map['default_capsule_title'] as String?,
      defaultCapsuleMessage: map['default_capsule_message'] as String?,
      defaultLockedTitle: map['default_locked_title'] as String?,
      defaultLockedMessage: map['default_locked_message'] as String?,
    );
  }
}
