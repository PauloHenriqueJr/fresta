class ProfileModel {
  const ProfileModel({
    required this.id,
    this.email,
    this.displayName,
    this.avatar,
    this.themePreference,
    this.onboardingCompleted = false,
    this.role,
  });

  final String id;
  final String? email;
  final String? displayName;
  final String? avatar;
  final String? themePreference;
  final bool onboardingCompleted;
  final String? role;

  factory ProfileModel.fromMap(Map<String, dynamic> map) {
    return ProfileModel(
      id: map['id'] as String,
      email: map['email'] as String?,
      displayName: map['display_name'] as String?,
      avatar: map['avatar'] as String?,
      themePreference: map['theme_preference'] as String?,
      onboardingCompleted: (map['onboarding_completed'] as bool?) ?? false,
      role: map['role'] as String?,
    );
  }

  ProfileModel copyWith({
    String? id,
    String? email,
    String? displayName,
    String? avatar,
    String? themePreference,
    bool? onboardingCompleted,
    String? role,
  }) {
    return ProfileModel(
      id: id ?? this.id,
      email: email ?? this.email,
      displayName: displayName ?? this.displayName,
      avatar: avatar ?? this.avatar,
      themePreference: themePreference ?? this.themePreference,
      onboardingCompleted: onboardingCompleted ?? this.onboardingCompleted,
      role: role ?? this.role,
    );
  }
}
