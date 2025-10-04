import { redirect } from 'next/navigation';

export default function HomePage() {
  // Always redirect to the starting scene of the default case
  redirect('/game/case-001/scene/theatre');
}
