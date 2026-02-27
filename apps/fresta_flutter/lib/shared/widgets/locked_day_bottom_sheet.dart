import 'dart:async';
import 'package:flutter/material.dart';
import 'package:lucide_icons_flutter/lucide_icons.dart';
import 'package:intl/intl.dart';

import '../../app/theme/calendar_theme_config.dart';

/// Rich Locked Day Bottom Sheet — matches web's LockedModal.
/// Shows countdown timer, "Avisar-me" button, themed visuals.
class LockedDayBottomSheet extends StatefulWidget {
  const LockedDayBottomSheet({
    super.key,
    required this.dayNumber,
    required this.unlockDate,
    required this.themeConfig,
    this.onNotifyMe,
  });

  final int dayNumber;
  final DateTime unlockDate;
  final CalendarThemeConfig themeConfig;
  final VoidCallback? onNotifyMe;

  /// Show this as a modal bottom sheet.
  static Future<void> show(
    BuildContext context, {
    required int dayNumber,
    required DateTime unlockDate,
    required CalendarThemeConfig themeConfig,
    VoidCallback? onNotifyMe,
  }) {
    return showModalBottomSheet(
      context: context,
      backgroundColor: Colors.transparent,
      isScrollControlled: true,
      builder: (_) => LockedDayBottomSheet(
        dayNumber: dayNumber,
        unlockDate: unlockDate,
        themeConfig: themeConfig,
        onNotifyMe: onNotifyMe,
      ),
    );
  }

  @override
  State<LockedDayBottomSheet> createState() => _LockedDayBottomSheetState();
}

class _LockedDayBottomSheetState extends State<LockedDayBottomSheet> {
  Timer? _timer;
  Duration _remaining = Duration.zero;

  @override
  void initState() {
    super.initState();
    _updateRemaining();
    _timer = Timer.periodic(const Duration(seconds: 1), (_) => _updateRemaining());
  }

  void _updateRemaining() {
    final now = DateTime.now();
    final diff = widget.unlockDate.difference(now);
    if (mounted) {
      setState(() {
        _remaining = diff.isNegative ? Duration.zero : diff;
      });
    }
  }

  @override
  void dispose() {
    _timer?.cancel();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final style = widget.themeConfig.lockedModalStyle;
    final isDark = Theme.of(context).brightness == Brightness.dark;

    final days = _remaining.inDays;
    final hours = _remaining.inHours % 24;
    final minutes = _remaining.inMinutes % 60;
    final seconds = _remaining.inSeconds % 60;

    final dateStr = DateFormat("d 'de' MMMM", 'pt_BR').format(widget.unlockDate);

    return Container(
      decoration: BoxDecoration(
        color: isDark ? Theme.of(context).colorScheme.surface : style.bgColor,
        borderRadius: const BorderRadius.vertical(top: Radius.circular(32)),
        border: Border.all(color: style.borderColor, width: 1.5),
      ),
      child: SafeArea(
        top: false,
        child: Padding(
          padding: const EdgeInsets.fromLTRB(24, 12, 24, 24),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              // Drag handle
              Container(
                width: 40,
                height: 4,
                decoration: BoxDecoration(
                  color: style.borderColor,
                  borderRadius: BorderRadius.circular(2),
                ),
              ),
              const SizedBox(height: 24),

              // Lock icon circle
              Container(
                width: 72,
                height: 72,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  color: style.iconColor.withValues(alpha: 0.1),
                ),
                child: Icon(
                  LucideIcons.lock,
                  size: 32,
                  color: style.iconColor,
                ),
              ),
              const SizedBox(height: 20),

              // Title
              Text(
                style.title,
                style: TextStyle(
                  fontSize: 22,
                  fontWeight: FontWeight.w900,
                  color: isDark ? Colors.white : style.textColor,
                  letterSpacing: -0.5,
                ),
              ),
              const SizedBox(height: 8),

              // Message
              Text(
                style.message,
                textAlign: TextAlign.center,
                style: TextStyle(
                  fontSize: 15,
                  fontWeight: FontWeight.w500,
                  color: isDark ? Colors.white70 : style.textColor.withValues(alpha: 0.6),
                  height: 1.4,
                ),
              ),
              const SizedBox(height: 24),

              // Countdown timer
              Container(
                padding: const EdgeInsets.all(20),
                decoration: BoxDecoration(
                  color: isDark
                      ? Colors.white.withValues(alpha: 0.05)
                      : style.iconColor.withValues(alpha: 0.05),
                  borderRadius: BorderRadius.circular(20),
                  border: Border.all(
                    color: style.iconColor.withValues(alpha: 0.1),
                  ),
                ),
                child: Column(
                  children: [
                    Text(
                      'Porta ${ widget.dayNumber } abre em',
                      style: TextStyle(
                        fontSize: 11,
                        fontWeight: FontWeight.w800,
                        color: style.iconColor,
                        letterSpacing: 0.5,
                      ),
                    ),
                    const SizedBox(height: 12),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        if (days > 0) ...[
                          _CountdownUnit(value: days, label: 'dias', color: style.textColor, isDark: isDark),
                          _CountdownSeparator(color: style.textColor, isDark: isDark),
                        ],
                        _CountdownUnit(value: hours, label: 'hrs', color: style.textColor, isDark: isDark),
                        _CountdownSeparator(color: style.textColor, isDark: isDark),
                        _CountdownUnit(value: minutes, label: 'min', color: style.textColor, isDark: isDark),
                        _CountdownSeparator(color: style.textColor, isDark: isDark),
                        _CountdownUnit(value: seconds, label: 'seg', color: style.textColor, isDark: isDark),
                      ],
                    ),
                    const SizedBox(height: 8),
                    Text(
                      dateStr,
                      style: TextStyle(
                        fontSize: 12,
                        fontWeight: FontWeight.w600,
                        color: isDark ? Colors.white38 : style.textColor.withValues(alpha: 0.4),
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 24),

              // Notify me button
              if (widget.onNotifyMe != null)
                SizedBox(
                  width: double.infinity,
                  child: FilledButton.icon(
                    onPressed: () {
                      widget.onNotifyMe?.call();
                      Navigator.of(context).pop();
                    },
                    icon: const Icon(LucideIcons.bell, size: 18),
                    label: const Text(
                      'Me avise quando abrir',
                      style: TextStyle(fontWeight: FontWeight.w800, fontSize: 15),
                    ),
                    style: FilledButton.styleFrom(
                      backgroundColor: style.buttonGradient != null ? null : style.buttonColor,
                      foregroundColor: widget.themeConfig.isDarkTheme ? Colors.black : Colors.white,
                      padding: const EdgeInsets.symmetric(vertical: 16),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                    ),
                  ),
                ),
              const SizedBox(height: 12),

              // Dismiss button
              SizedBox(
                width: double.infinity,
                child: TextButton(
                  onPressed: () => Navigator.of(context).pop(),
                  style: TextButton.styleFrom(
                    padding: const EdgeInsets.symmetric(vertical: 14),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                  ),
                  child: Text(
                    'Vou esperar ansiosamente 💫',
                    style: TextStyle(
                      fontWeight: FontWeight.w700,
                      fontSize: 14,
                      color: isDark ? Colors.white54 : style.textColor.withValues(alpha: 0.5),
                    ),
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class _CountdownUnit extends StatelessWidget {
  const _CountdownUnit({
    required this.value,
    required this.label,
    required this.color,
    required this.isDark,
  });

  final int value;
  final String label;
  final Color color;
  final bool isDark;

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Text(
          value.toString().padLeft(2, '0'),
          style: TextStyle(
            fontSize: 28,
            fontWeight: FontWeight.w900,
            color: isDark ? Colors.white : color,
            fontFeatures: const [FontFeature.tabularFigures()],
          ),
        ),
        Text(
          label,
          style: TextStyle(
            fontSize: 10,
            fontWeight: FontWeight.w700,
            color: isDark ? Colors.white38 : color.withValues(alpha: 0.4),
          ),
        ),
      ],
    );
  }
}

class _CountdownSeparator extends StatelessWidget {
  const _CountdownSeparator({required this.color, required this.isDark});

  final Color color;
  final bool isDark;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 8),
      child: Text(
        ':',
        style: TextStyle(
          fontSize: 24,
          fontWeight: FontWeight.w900,
          color: isDark ? Colors.white24 : color.withValues(alpha: 0.3),
        ),
      ),
    );
  }
}
