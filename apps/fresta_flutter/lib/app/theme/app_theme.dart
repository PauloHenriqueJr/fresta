import 'package:flutter/material.dart';

class AppTheme {
  static ThemeData light() {
    const background = Color(0xFFF6F1E8);
    const surface = Color(0xFFFFFBF5);
    const ink = Color(0xFF1D1B16);
    const forest = Color(0xFF164A3C);
    const clay = Color(0xFFD86F45);
    const gold = Color(0xFFB68A2A);

    final scheme = ColorScheme.fromSeed(
      seedColor: forest,
      brightness: Brightness.light,
      primary: forest,
      secondary: clay,
      tertiary: gold,
      surface: surface,
    );

    return ThemeData(
      colorScheme: scheme,
      useMaterial3: true,
      scaffoldBackgroundColor: background,
      appBarTheme: const AppBarTheme(
        centerTitle: false,
        backgroundColor: Colors.transparent,
        foregroundColor: ink,
        elevation: 0,
      ),
      textTheme: const TextTheme(
        headlineLarge: TextStyle(
          fontSize: 34,
          height: 1.02,
          fontWeight: FontWeight.w800,
          letterSpacing: -0.8,
          color: ink,
        ),
        headlineMedium: TextStyle(
          fontSize: 28,
          fontWeight: FontWeight.w800,
          letterSpacing: -0.6,
          color: ink,
        ),
        headlineSmall: TextStyle(
          fontSize: 22,
          fontWeight: FontWeight.w700,
          letterSpacing: -0.4,
          color: ink,
        ),
        titleMedium: TextStyle(
          fontSize: 16,
          fontWeight: FontWeight.w700,
          color: ink,
        ),
        bodyMedium: TextStyle(
          fontSize: 14,
          height: 1.35,
          color: Color(0xFF413B31),
        ),
      ),
      inputDecorationTheme: const InputDecorationTheme(
        filled: true,
        fillColor: Colors.white,
        contentPadding: EdgeInsets.symmetric(horizontal: 16, vertical: 14),
        border: OutlineInputBorder(
          borderRadius: BorderRadius.all(Radius.circular(16)),
          borderSide: BorderSide(color: Color(0xFFE6DCCB)),
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.all(Radius.circular(16)),
          borderSide: BorderSide(color: Color(0xFFE6DCCB)),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.all(Radius.circular(16)),
          borderSide: BorderSide(color: forest, width: 1.4),
        ),
      ),
      cardTheme: CardThemeData(
        elevation: 0,
        color: Colors.white.withValues(alpha: 0.92),
        margin: EdgeInsets.zero,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(22),
          side: const BorderSide(color: Color(0x1A1D1B16)),
        ),
      ),
      filledButtonTheme: FilledButtonThemeData(
        style: FilledButton.styleFrom(
          backgroundColor: forest,
          foregroundColor: Colors.white,
          minimumSize: const Size.fromHeight(52),
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(18)),
          textStyle: const TextStyle(fontWeight: FontWeight.w700),
        ),
      ),
      outlinedButtonTheme: OutlinedButtonThemeData(
        style: OutlinedButton.styleFrom(
          minimumSize: const Size.fromHeight(52),
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(18)),
          side: const BorderSide(color: Color(0x33164A3C)),
          foregroundColor: ink,
        ),
      ),
    );
  }
}
