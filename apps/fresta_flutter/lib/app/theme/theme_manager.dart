import 'calendar_theme_config.dart';
import 'themes/birthday_theme_config.dart';
import 'themes/bodas_theme_config.dart';
import 'themes/carnaval_theme_config.dart';
import 'themes/christmas_theme_config.dart';
import 'themes/dating_theme_config.dart';
import 'themes/default_theme_config.dart';
import 'themes/diadascriancas_theme_config.dart';
import 'themes/diadasmaes_theme_config.dart';
import 'themes/diadospais_theme_config.dart';
import 'themes/estudos_theme_config.dart';
import 'themes/independencia_theme_config.dart';
import 'themes/metas_theme_config.dart';
import 'themes/noivado_theme_config.dart';
import 'themes/pascoa_theme_config.dart';
import 'themes/reveillon_theme_config.dart';
import 'themes/saojoao_theme_config.dart';
import 'themes/travel_theme_config.dart';
import 'themes/wedding_theme_config.dart';

class ThemeManager {
  static final Map<String, CalendarThemeConfig> _themes = {
    'namoro': DatingThemeConfig(),
    'casamento': WeddingThemeConfig(),
    'bodas': BodasThemeConfig(),
    'noivado': NoivadoThemeConfig(),
    'aniversario': BirthdayThemeConfig(),
    'natal': ChristmasThemeConfig(),
    'viagem': TravelThemeConfig(),
    'carnaval': CarnavalThemeConfig(),
    'saojoao': SaojoaoThemeConfig(),
    'reveillon': ReveillonThemeConfig(),
    'pascoa': PascoaThemeConfig(),
    'diadasmaes': DiadasmaesThemeConfig(),
    'diadospais': DiadospaisThemeConfig(),
    'diadascriancas': DiadascriancasThemeConfig(),
    'independencia': IndependenciaThemeConfig(),
    'estudos': EstudosThemeConfig(),
    'estudo': EstudosThemeConfig(),
    'metas': MetasThemeConfig(),
  };

  static final CalendarThemeConfig _defaultTheme = DefaultThemeConfig();

  static CalendarThemeConfig getTheme(String? themeId) {
    if (themeId == null || themeId.isEmpty) {
      return _defaultTheme;
    }
    return _themes[themeId.toLowerCase()] ?? _defaultTheme;
  }

  /// Returns the mascot asset path for a given themeId
  static String? getMascotAssetPath(String? themeId) {
    if (themeId == null || themeId.isEmpty) return null;
    final key = themeId.toLowerCase();
    const mapping = <String, String>{
      'namoro': 'assets/images/themes/mascot-namoro.jpg',
      'casamento': 'assets/images/themes/mascot-casamento.jpg',
      'bodas': 'assets/images/themes/mascot-bodas.jpg',
      'noivado': 'assets/images/themes/mascot-noivado.jpg',
      'aniversario': 'assets/images/themes/mascot-aniversario.jpg',
      'natal': 'assets/images/themes/mascot-natal.jpg',
      'viagem': 'assets/images/themes/mascot-viagem.jpg',
      'carnaval': 'assets/images/themes/mascot-carnaval.jpg',
      'saojoao': 'assets/images/themes/mascot-saojoao.png',
      'reveillon': 'assets/images/themes/mascot-reveillon.jpg',
      'pascoa': 'assets/images/themes/mascot-pascoa.jpg',
      'diadasmaes': 'assets/images/themes/mascot-diadasmaes.jpg',
      'diadospais': 'assets/images/themes/mascot-diadospais.jpg',
      'diadascriancas': 'assets/images/themes/mascot-diadascriancas.jpg',
      'independencia': 'assets/images/themes/mascot-independencia.jpg',
      'estudo': 'assets/images/themes/mascot-estudo.jpg',
      'estudos': 'assets/images/themes/mascot-estudo.jpg',
      'metas': 'assets/images/themes/mascot-metas.jpg',
    };
    return mapping[key];
  }
}
