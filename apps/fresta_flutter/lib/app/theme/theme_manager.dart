import 'calendar_theme_config.dart';
import 'themes/birthday_theme_config.dart';
import 'themes/christmas_theme_config.dart';
import 'themes/dating_theme_config.dart';
import 'themes/default_theme_config.dart';
import 'themes/travel_theme_config.dart';
import 'themes/wedding_theme_config.dart';

class ThemeManager {
  static final Map<String, CalendarThemeConfig> _themes = {
    'namoro': DatingThemeConfig(),
    'casamento': WeddingThemeConfig(),
    'aniversario': BirthdayThemeConfig(),
    'natal': ChristmasThemeConfig(),
    'viagem': TravelThemeConfig(),


    // Add other themes here mapped by their ID
  };

  static final CalendarThemeConfig _defaultTheme = DefaultThemeConfig();

  static CalendarThemeConfig getTheme(String? themeId) {
    if (themeId == null || themeId.isEmpty) {
      return _defaultTheme;
    }
    return _themes[themeId.toLowerCase()] ?? _defaultTheme;
  }
}
