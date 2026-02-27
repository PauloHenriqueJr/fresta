import 'package:flutter/material.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:intl/date_symbol_data_local.dart';

import 'app/app.dart';
import 'core/env/app_env.dart';
import 'core/services/notification_service.dart';
import 'data/supabase/supabase_bootstrap.dart';

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await initializeDateFormatting('pt_BR', null);
  
  // Initialize notifications
  final notificationService = NotificationService();
  await notificationService.init();

  await dotenv.load(fileName: '.env').catchError((_) {});

  Object? bootstrapError;
  if (AppEnv.hasSupabaseConfig) {
    try {
      await SupabaseBootstrap.ensureInitialized();
    } catch (e) {
      bootstrapError = e;
    }
  }

  runApp(
    ProviderScope(
      child: bootstrapError != null || !AppEnv.hasSupabaseConfig
          ? ConfigErrorApp(error: bootstrapError)
          : const FrestaApp(),
    ),
  );
}

class ConfigErrorApp extends StatelessWidget {
  const ConfigErrorApp({super.key, this.error});

  final Object? error;

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      home: Scaffold(
        body: SafeArea(
          child: Padding(
            padding: const EdgeInsets.all(24),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text(
                  'Fresta Flutter MVP',
                  style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
                ),
                const SizedBox(height: 12),
                const Text(
                  'Defina as variáveis via --dart-define para iniciar o app:',
                ),
                const SizedBox(height: 12),
                const SelectableText(
                  'FRESTA_SUPABASE_URL\nFRESTA_SUPABASE_ANON_KEY\nFRESTA_PUBLIC_BASE_URL (opcional)',
                ),
                if (error != null) ...[
                  const SizedBox(height: 16),
                  Text('Erro: $error'),
                ],
                const SizedBox(height: 16),
                const Text(
                  'Dica: use apps/fresta_flutter/.env (ou --dart-define como fallback).',
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
