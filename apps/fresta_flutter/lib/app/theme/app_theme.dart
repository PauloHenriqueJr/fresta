import 'package:flutter/material.dart';

class AppTheme {
  // Brand Colors
  static const ink = Color(0xFF1B4D3E); // Deep Green
  static const forest = Color(0xFF2D7A5F); // Forest Green
  static const gold = Color(0xFFF9A03F); // Muted Gold
  static const leaf = Color(0xFFE8F5E0); // Light Green
  static const background = Color(0xFFF8F9F5); // Off-White
  
  static ThemeData light() {
    final scheme = ColorScheme.fromSeed(
      seedColor: forest,
      brightness: Brightness.light,
      primary: forest,
      secondary: gold,
      tertiary: ink,
      surface: Colors.white,
      error: const Color(0xFFDC2626),
      onPrimary: Colors.white,
      onSecondary: Colors.white,
      onSurface: ink,
    );

    return _buildTheme(scheme, background);
  }

  static ThemeData dark() {
    const darkBg = Color(0xFF0F1A16); // Very Dark Green
    const darkSurface = Color(0xFF1B2A24);
    
    final scheme = ColorScheme.fromSeed(
      seedColor: forest,
      brightness: Brightness.dark,
      primary: const Color(0xFF4ADE80), // Vibrant Green for dark mode
      secondary: gold,
      tertiary: const Color(0xFF2D7A5F), // Darker Forest Green for contrast
      surface: darkSurface,
      error: const Color(0xFFEF4444),
      onPrimary: darkBg,
      onSecondary: Colors.white,
      onSurface: const Color(0xFFF8F9F5),
    );

    return _buildTheme(scheme, darkBg);
  }

  static ThemeData _buildTheme(ColorScheme scheme, Color bg) {
    return ThemeData(
      colorScheme: scheme,
      useMaterial3: true,
      scaffoldBackgroundColor: bg,
      appBarTheme: AppBarTheme(
        centerTitle: false,
        backgroundColor: Colors.transparent,
        foregroundColor: scheme.onSurface,
        elevation: 0,
        titleTextStyle: TextStyle(
          fontSize: 20,
          fontWeight: FontWeight.w800,
          color: scheme.onSurface,
          letterSpacing: -0.5,
        ),
      ),
      textTheme: TextTheme(
        headlineLarge: TextStyle(
          fontSize: 34,
          height: 1.02,
          fontWeight: FontWeight.w800,
          letterSpacing: -0.8,
          color: scheme.onSurface,
        ),
        headlineMedium: TextStyle(
          fontSize: 28,
          fontWeight: FontWeight.w800,
          letterSpacing: -0.6,
          color: scheme.onSurface,
        ),
        headlineSmall: TextStyle(
          fontSize: 22,
          fontWeight: FontWeight.w700,
          letterSpacing: -0.4,
          color: scheme.onSurface,
        ),
        titleMedium: TextStyle(
          fontSize: 16,
          fontWeight: FontWeight.w700,
          color: scheme.onSurface,
        ),
        bodyMedium: TextStyle(
          fontSize: 14,
          height: 1.35,
          color: scheme.onSurface.withValues(alpha: 0.8),
        ),
      ),
      inputDecorationTheme: InputDecorationTheme(
        filled: true,
        fillColor: scheme.surface,
        contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
        border: OutlineInputBorder(
          borderRadius: const BorderRadius.all(Radius.circular(16)),
          borderSide: BorderSide(color: scheme.onSurface.withValues(alpha: 0.1)),
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: const BorderRadius.all(Radius.circular(16)),
          borderSide: BorderSide(color: scheme.onSurface.withValues(alpha: 0.1)),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: const BorderRadius.all(Radius.circular(16)),
          borderSide: BorderSide(color: scheme.primary, width: 1.4),
        ),
      ),
      cardTheme: CardThemeData(
        elevation: 0,
        color: scheme.surface.withValues(alpha: 0.92),
        margin: EdgeInsets.zero,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(22),
          side: BorderSide(color: scheme.onSurface.withValues(alpha: 0.1)),
        ),
      ),
      filledButtonTheme: FilledButtonThemeData(
        style: FilledButton.styleFrom(
          backgroundColor: scheme.primary,
          foregroundColor: scheme.onPrimary,
          minimumSize: const Size.fromHeight(52),
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(18)),
          textStyle: const TextStyle(fontWeight: FontWeight.w700),
        ),
      ),
      outlinedButtonTheme: OutlinedButtonThemeData(
        style: OutlinedButton.styleFrom(
          minimumSize: const Size.fromHeight(52),
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(18)),
          side: BorderSide(color: scheme.onSurface.withValues(alpha: 0.2)),
          foregroundColor: scheme.onSurface,
        ),
      ),
    );
  }
}
