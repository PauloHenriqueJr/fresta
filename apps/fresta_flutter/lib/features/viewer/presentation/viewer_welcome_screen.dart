import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

class ViewerWelcomeScreen extends StatefulWidget {
  const ViewerWelcomeScreen({super.key});

  @override
  State<ViewerWelcomeScreen> createState() => _ViewerWelcomeScreenState();
}

class _ViewerWelcomeScreenState extends State<ViewerWelcomeScreen> {
  final _controller = TextEditingController();
  String? _error;

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  void _openLink() {
    final value = _controller.text.trim();
    if (value.isEmpty) {
      setState(() => _error = 'Cole um link ou ID de calendário.');
      return;
    }

    Uri? uri = Uri.tryParse(value);
    if (uri == null) {
      // Accept plain ID input.
      if (_looksLikeCalendarId(value)) {
        context.go('/c/$value');
        return;
      }
      setState(() => _error = 'Link inválido. Use https://.../c/<id> ou apenas o ID.');
      return;
    }

    String? id;
    if (uri.pathSegments.length >= 2 && uri.pathSegments.first == 'c') {
      id = uri.pathSegments[1];
    } else if (value.startsWith('/c/')) {
      id = value.substring(3);
    } else if (_looksLikeCalendarId(value)) {
      id = value;
    }

    if (id != null && id.isNotEmpty && mounted) {
      setState(() => _error = null);
      context.go('/c/$id');
      return;
    }

    setState(() => _error = 'Não consegui encontrar o ID do calendário nesse link.');
  }

  bool _looksLikeCalendarId(String value) {
    final v = value.trim();
    if (v.isEmpty) return false;
    if (v.contains(' ')) return false;
    if (v.contains('/')) return false;
    return v.length >= 8;
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Scaffold(
      body: Container(
        decoration: const BoxDecoration(
          gradient: LinearGradient(
            colors: [Color(0xFFF6F1E8), Color(0xFFF0E7DA), Color(0xFFECE3D4)],
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
                    onPressed: () => context.go('/'),
                    icon: const Icon(Icons.arrow_back_ios_new_rounded),
                  ),
                  const SizedBox(width: 2),
                  const Text(
                    'Modo visualização',
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
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text('Abra um calendário compartilhado', style: theme.textTheme.headlineSmall),
                    const SizedBox(height: 8),
                    const Text(
                      'Cole um link do Fresta ou apenas o ID. Quem recebe o link não precisa fazer login para visualizar.',
                    ),
                    const SizedBox(height: 14),
                    TextField(
                      controller: _controller,
                      onSubmitted: (_) => _openLink(),
                      decoration: const InputDecoration(
                        hintText: 'https://fresta.com/c/<id> ou <id>',
                        labelText: 'Link ou ID do calendário',
                        prefixIcon: Icon(Icons.link_rounded),
                      ),
                    ),
                    if (_error != null) ...[
                      const SizedBox(height: 10),
                      Container(
                        padding: const EdgeInsets.all(10),
                        decoration: BoxDecoration(
                          color: const Color(0xFFFFECEA),
                          borderRadius: BorderRadius.circular(12),
                        ),
                        child: Row(
                          children: [
                            const Icon(Icons.error_outline_rounded, size: 18, color: Color(0xFFB33B2E)),
                            const SizedBox(width: 8),
                            Expanded(
                              child: Text(
                                _error!,
                                style: const TextStyle(
                                  color: Color(0xFFB33B2E),
                                  fontWeight: FontWeight.w600,
                                ),
                              ),
                            ),
                          ],
                        ),
                      ),
                    ],
                    const SizedBox(height: 14),
                    FilledButton.icon(
                      onPressed: _openLink,
                      icon: const Icon(Icons.open_in_new_rounded),
                      label: const Text('Abrir calendário'),
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
                    children: const [
                      Text('Dicas rápidas', style: TextStyle(fontWeight: FontWeight.w700)),
                      SizedBox(height: 8),
                      Text('• Links funcionam em app ou web'),
                      Text('• Calendários com senha pedem desbloqueio no viewer'),
                      Text('• Você pode entrar depois para criar o seu'),
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
