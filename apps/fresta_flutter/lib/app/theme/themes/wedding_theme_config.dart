import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:lucide_icons_flutter/lucide_icons.dart';

import '../calendar_theme_config.dart';

class WeddingThemeConfig implements CalendarThemeConfig {
  @override
  String get id => 'casamento';

  @override
  Color get primaryColor => const Color(0xFFB5942F); // Gold
  
  @override
  Color get secondaryColor => const Color(0xFFD4AF37); // Light Gold
  
  @override
  Color get surfaceColor => const Color(0xFFFDFBF7); // Elegant off-white

  @override
  List<Color> get headerGradient => [const Color(0xFFD4AF37), const Color(0xFFB5942F)];

  @override
  Color titleColor(BuildContext context) {
    return Theme.of(context).brightness == Brightness.dark ? Colors.white : const Color(0xFFB5942F);
  }

  @override
  Color textColor(BuildContext context) {
    return Theme.of(context).brightness == Brightness.dark ? Colors.white70 : const Color(0xFFB5942F).withValues(alpha: 0.8);
  }

  @override
  Color scaffoldBackgroundColor(BuildContext context) {
    return Theme.of(context).brightness == Brightness.dark 
        ? Theme.of(context).scaffoldBackgroundColor 
        : const Color(0xFFFFFCF5); // Web Wedding Background
  }

  @override
  TextStyle get titleStyle => GoogleFonts.playfairDisplay(
        fontWeight: FontWeight.bold,
        fontStyle: FontStyle.italic,
      );

  @override
  TextStyle get bodyStyle => GoogleFonts.plusJakartaSans(fontWeight: FontWeight.w500);

  @override
  Widget? buildFloatingComponent(BuildContext context) => null; // We can add floating rings/sparkles later if needed

  @override
  Widget? buildHeaderComponent(BuildContext context) => null; // Web uses 'Private Event' badge

  @override
  BoxDecoration cardDecoration(BuildContext context) {
    return BoxDecoration(
      color: Colors.white,
      borderRadius: BorderRadius.circular(24),
      border: Border.all(color: const Color(0xFFD4AF37).withValues(alpha: 0.2), width: 2),
      boxShadow: [
        BoxShadow(
          color: const Color(0xFFD4AF37).withValues(alpha: 0.05),
          blurRadius: 10,
          offset: const Offset(0, 4),
        ),
      ],
    );
  }

  @override
  Widget buildBackground(BuildContext context, Widget child) {
    // We could return a custom pattern here, for now using solid background matching web
    return Container(
      color: scaffoldBackgroundColor(context),
      child: child,
    );
  }

  @override
  IconData get defaultIcon => LucideIcons.heart; // Assuming LucideIcons.heart

  @override
  IconData get lockedIcon => LucideIcons.lock;
}
