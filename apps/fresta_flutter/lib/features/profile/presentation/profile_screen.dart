import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../auth/application/auth_controller.dart';

class ProfileScreen extends ConsumerWidget {
  const ProfileScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final auth = ref.watch(authControllerProvider);
    final profile = auth.profile;
    final user = auth.user;
    final display = profile?.displayName ?? user?.email ?? 'Usuário';
    final initial = (display.isNotEmpty ? display.characters.first : 'U').toUpperCase();

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
                    onPressed: () => context.go('/creator/home'),
                    icon: const Icon(Icons.arrow_back_ios_new_rounded),
                  ),
                  const SizedBox(width: 2),
                  const Text('Perfil', style: TextStyle(fontWeight: FontWeight.w700, fontSize: 18)),
                ],
              ),
              const SizedBox(height: 8),
              Container(
                padding: const EdgeInsets.all(18),
                decoration: BoxDecoration(
                  color: const Color(0xFFFFFBF5),
                  borderRadius: BorderRadius.circular(24),
                  border: Border.all(color: const Color(0xFFF0E6D8)),
                ),
                child: Row(
                  children: [
                    CircleAvatar(
                      radius: 28,
                      backgroundColor: const Color(0xFF164A3C),
                      child: Text(
                        initial,
                        style: const TextStyle(
                          color: Colors.white,
                          fontWeight: FontWeight.w800,
                          fontSize: 20,
                        ),
                      ),
                    ),
                    const SizedBox(width: 14),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            display,
                            style: Theme.of(context).textTheme.titleLarge,
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                          ),
                          const SizedBox(height: 4),
                          Text(user?.email ?? profile?.email ?? 'Sem e-mail'),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 12),
              Card(
                child: Column(
                  children: [
                    ListTile(
                      leading: const Icon(Icons.settings_outlined),
                      title: const Text('Configurações da conta'),
                      subtitle: const Text('Preferências e sessão'),
                      trailing: const Icon(Icons.chevron_right_rounded),
                      onTap: () => context.go('/account/settings'),
                    ),
                    const Divider(height: 1),
                    ListTile(
                      leading: const Icon(Icons.calendar_month_outlined),
                      title: const Text('Meus calendários'),
                      subtitle: const Text('Abrir área de criação'),
                      trailing: const Icon(Icons.chevron_right_rounded),
                      onTap: () => context.go('/creator/home'),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
