import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../../../data/repositories/calendars_repository.dart';
import '../../auth/application/auth_controller.dart';

/// Defines the limits for a specific calendar based on its premium status.
class PlanLimits {
  const PlanLimits({
    required this.isPremium,
    required this.maxDays,
    required this.canUploadPhotos,
    required this.canEmbedVideos,
    required this.canUseAllThemes,
    required this.showAds,
    required this.showUpgradePrompt,
  });

  final bool isPremium;
  final int maxDays;
  final bool canUploadPhotos;
  final bool canEmbedVideos;
  final bool canUseAllThemes;
  final bool showAds;
  final bool showUpgradePrompt;

  static const free = PlanLimits(
    isPremium: false,
    maxDays: 7,
    canUploadPhotos: false,
    canEmbedVideos: false,
    canUseAllThemes: false,
    showAds: true,
    showUpgradePrompt: true,
  );

  static const premium = PlanLimits(
    isPremium: true,
    maxDays: 365,
    canUploadPhotos: true,
    canEmbedVideos: true,
    canUseAllThemes: true,
    showAds: false,
    showUpgradePrompt: false,
  );

  // Admin gets all features
  static const admin = PlanLimits(
    isPremium: true,
    maxDays: 365,
    canUploadPhotos: true,
    canEmbedVideos: true,
    canUseAllThemes: true,
    showAds: false,
    showUpgradePrompt: false,
  );
}

/// Plus-only themes that require payment to access.
const plusThemes = [
  'casamento',
  'bodas',
  'noivado',
  'reveillon',
  'viagem',
  'natal',
  'pascoa',
  'saojoao',
  'independencia',
];

/// Returns PlanLimits for a specific calendar by its ID.
final calendarPlanLimitsProvider =
    FutureProvider.family<PlanLimits, String>((ref, calendarId) async {
  final detail = await ref.watch(
    calendarsRepositoryProvider
        .select((repo) => repo.getOwnerCalendarDetail(calendarId)),
  );
  if (detail == null) return PlanLimits.free;
  return detail.calendar.isPremium ? PlanLimits.premium : PlanLimits.free;
});

/// User-level plan status (admin check, calendar counts).
class UserPlanStatus {
  const UserPlanStatus({
    required this.isAdmin,
    required this.freeCalendarCount,
    required this.premiumCalendarCount,
    required this.isLoading,
  });

  final bool isAdmin;
  final int freeCalendarCount;
  final int premiumCalendarCount;
  final bool isLoading;

  bool get hasUsedFreeCalendar => freeCalendarCount > 0;
  bool get canCreateFreeCalendar => isAdmin || !hasUsedFreeCalendar;
}

final userPlanStatusProvider = FutureProvider<UserPlanStatus>((ref) async {
  final auth = ref.watch(authControllerProvider);
  final user = auth.user;
  if (user == null) {
    return const UserPlanStatus(
      isAdmin: false,
      freeCalendarCount: 0,
      premiumCalendarCount: 0,
      isLoading: false,
    );
  }

  final isAdmin = auth.profile?.role == 'admin';
  final calendars = await ref.watch(calendarsRepositoryProvider).listOwnedCalendars(user.id);

  final freeCount = calendars.where((c) => !c.isPremium).length;
  final premiumCount = calendars.where((c) => c.isPremium).length;

  return UserPlanStatus(
    isAdmin: isAdmin,
    freeCalendarCount: freeCount,
    premiumCalendarCount: premiumCount,
    isLoading: false,
  );
});
