import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../auth/application/auth_controller.dart';

class AccountSettingsScreen extends ConsumerStatefulWidget {
  const AccountSettingsScreen({super.key});

  @override
  ConsumerState<AccountSettingsScreen> createState() => _AccountSettingsScreenState();
}

class _AccountSettingsScreenState extends ConsumerState<AccountSettingsScreen> {
  bool notifications = true;

  @override
  Widget build(BuildContext context) {
    final auth = ref.watch(authControllerProvider);

    return Scaffold(
      body: Container(
        decoration: const BoxDecoration(
          gradient: LinearGradient(
            colors: [Color(0xFFF6F1E8), Color(0xFFEFE6D9)],
            begin: Alignment.topCenter,
            end: Alignment.bottomCenter,
          ),
        ),
        child: SafeArea(
          child: ListView(
            padding: const EdgeInsets.fromLTRB(20, 14, 20, 24),
            children: [
              Row(
                children: [
                  IconButton(
                    onPressed: () => context.go('/account/profile'),
                    icon: const Icon(Icons.arrow_back_ios_new_rounded),
                  ),
                  const SizedBox(width: 2),
                  const Text('Configurações', style: TextStyle(fontWeight: FontWeight.w700, fontSize: 18)),
                ],
              ),
              const SizedBox(height: 8),
              Card(
                child: Column(
                  children: [
                    SwitchListTile(
                      value: notifications,
                      onChanged: (value) => setState(() => notifications = value),
                      title: const Text('Notificações (MVP placeholder)'),
                      subtitle: const Text('Push nativo entra na Fase 2.'),
                    ),
                    const Divider(height: 1),
                    ListTile(
                      leading: const Icon(Icons.palette_outlined),
                      title: const Text('Tema'),
                      subtitle: Text(auth.profile?.themePreference ?? 'system'),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 12),
              Card(
                child: Padding(
                  padding: const EdgeInsets.all(16),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text('Sessão', style: TextStyle(fontWeight: FontWeight.w700)),
                      const SizedBox(height: 8),
                      Text(auth.user?.email ?? 'Sem e-mail'),
                      const SizedBox(height: 14),
                      FilledButton.tonalIcon(
                        onPressed: () async {
                          await ref.read(authControllerProvider.notifier).signOut();
                          if (!mounted || !context.mounted) return;
                          context.go('/');
                        },
                        icon: const Icon(Icons.logout_rounded),
                        label: const Text('Sair da conta'),
                      ),
                    ],
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
