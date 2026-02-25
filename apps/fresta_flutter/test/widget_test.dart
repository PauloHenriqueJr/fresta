import 'package:flutter_test/flutter_test.dart';
import 'package:fresta_flutter/main.dart';

void main() {
  testWidgets('renders config error app placeholder', (tester) async {
    await tester.pumpWidget(const ConfigErrorApp());

    expect(find.text('Fresta Flutter MVP'), findsOneWidget);
    expect(find.textContaining('FRESTA_SUPABASE_URL'), findsOneWidget);
  });
}
