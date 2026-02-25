import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';

import '../../../data/repositories/calendars_repository.dart';
import '../../auth/application/auth_controller.dart';
import '../application/calendar_providers.dart';

class CreateCalendarScreen extends ConsumerStatefulWidget {
  const CreateCalendarScreen({super.key});

  @override
  ConsumerState<CreateCalendarScreen> createState() => _CreateCalendarScreenState();
}

class _CreateCalendarScreenState extends ConsumerState<CreateCalendarScreen> {
  final _titleController = TextEditingController();
  final _themeController = TextEditingController(text: 'aniversario');
  int _duration = 24;
  String _privacy = 'private';
  bool _saving = false;
  String? _error;

  @override
  void dispose() {
    _titleController.dispose();
    _themeController.dispose();
    super.dispose();
  }

  Future<void> _save() async {
    final user = ref.read(authControllerProvider).user;
    if (user == null) return;

    setState(() {
      _saving = true;
      _error = null;
    });

    try {
      final id = await ref.read(calendarsRepositoryProvider).createCalendar(
            ownerId: user.id,
            title: _titleController.text.trim().isEmpty
                ? 'Meu Calendário'
                : _titleController.text.trim(),
            themeId: _themeController.text.trim().isEmpty
                ? 'aniversario'
                : _themeController.text.trim(),
            duration: _duration,
            privacy: _privacy,
          );
      ref.invalidate(myCalendarsProvider);
      if (!mounted) return;
      context.go('/creator/calendars/$id');
    } catch (e) {
      if (!mounted) return;
      setState(() => _error = e.toString());
    } finally {
      if (mounted) setState(() => _saving = false);
    }
  }

  @override
  Widget build(BuildContext context) {
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
                  const Text(
                    'Criar calendário',
                    style: TextStyle(fontWeight: FontWeight.w700, fontSize: 18),
                  ),
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
                child: const Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'Comece pelo essencial',
                      style: TextStyle(fontWeight: FontWeight.w700, fontSize: 18),
                    ),
                    SizedBox(height: 8),
                    Text(
                      'Você pode editar os dias e personalizar o calendário logo depois de criar.',
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 12),
              Card(
                child: Padding(
                  padding: const EdgeInsets.all(16),
                  child: Column(
                    children: [
                      TextField(
                        controller: _titleController,
                        decoration: const InputDecoration(
                          labelText: 'Título',
                          prefixIcon: Icon(Icons.title_rounded),
                        ),
                      ),
                      const SizedBox(height: 12),
                      TextField(
                        controller: _themeController,
                        decoration: const InputDecoration(
                          labelText: 'Tema (theme_id)',
                          prefixIcon: Icon(Icons.palette_outlined),
                        ),
                      ),
                      const SizedBox(height: 12),
                      DropdownButtonFormField<int>(
                        initialValue: _duration,
                        items: const [7, 12, 24, 30].map((d) {
                          return DropdownMenuItem(value: d, child: Text('$d dias'));
                        }).toList(),
                        onChanged: (value) {
                          if (value != null) setState(() => _duration = value);
                        },
                        decoration: const InputDecoration(
                          labelText: 'Duração',
                          prefixIcon: Icon(Icons.timelapse_rounded),
                        ),
                      ),
                      const SizedBox(height: 12),
                      DropdownButtonFormField<String>(
                        initialValue: _privacy,
                        items: const [
                          DropdownMenuItem(value: 'private', child: Text('Privado')),
                          DropdownMenuItem(value: 'public', child: Text('Público')),
                        ],
                        onChanged: (value) {
                          if (value != null) setState(() => _privacy = value);
                        },
                        decoration: const InputDecoration(
                          labelText: 'Privacidade',
                          prefixIcon: Icon(Icons.lock_outline_rounded),
                        ),
                      ),
                    ],
                  ),
                ),
              ),
              if (_error != null) ...[
                const SizedBox(height: 12),
                Container(
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: const Color(0xFFFFECEA),
                    borderRadius: BorderRadius.circular(14),
                  ),
                  child: Text(
                    _error!,
                    style: const TextStyle(color: Color(0xFFB33B2E), fontWeight: FontWeight.w600),
                  ),
                ),
              ],
              const SizedBox(height: 16),
              FilledButton.icon(
                onPressed: _saving ? null : _save,
                icon: const Icon(Icons.auto_awesome_rounded),
                label: Text(_saving ? 'Criando...' : 'Criar calendário'),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
