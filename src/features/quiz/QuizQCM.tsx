import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useCardsStore } from '@/store/useCardsStore';
import { scheduleSession } from '@/core/logic/quiz/adaptivity';
import { generateOptions } from '@/core/logic/quiz/generateOptions';
import { OptionButton } from './components/OptionButton';
import { ProgressBar } from './components/ProgressBar';
import { FeedbackToast } from './components/FeedbackToast';
import { track } from '@/core/analytics/track';

export default function QuizQCM({ reverse = false }: { reverse?: boolean }) {
  const { cards, load } = useCardsStore();
  const loc = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(loc.search);
  const folderId = params.get('folder') ?? undefined;

  const [i, setI] = useState(0);
  const [feedback, setFeedback] = useState<null | 'correct' | 'almost' | 'wrong'>(null);

  useEffect(() => { void load({ folderId }); }, [folderId, load]);

  const session = useMemo(() => scheduleSession(cards).filter(Boolean), [cards]);
  const current = session[i];
  const options = current ? generateOptions(current, session, reverse ? 'def->term' : 'term->def') : [];

  useEffect(() => {
    if (!current && session.length > 0 && i < session.length) return; // ok
    if (!current && session.length === 0) return; // aucune carte
    // si current est undefined parce qu'on a dépassé (ex: suppression), on termine
    if (!current) navigate('/quiz/result?score=' + score);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current, session.length]);

  function choose(correct: boolean) {
  setFeedback(correct ? 'correct' : 'wrong');
  setTimeout(() => {
    setFeedback(null);
    const finished = i + 1 >= session.length;
    const nextScore = scoreNext(correct);
    if (!finished) {
      setI(i + 1);
    } else {
      track('quiz_finished', { mode: reverse ? 'reverse' : 'qcm', score: nextScore });
      navigate('/quiz/result?score=' + nextScore);
    }
  }, 400);
}

  const [score, setScore] = useState(0);
  function scoreNext(lastCorrect: boolean) {
    const s = score + (lastCorrect ? 1 : 0);
    setScore(s);
    return s;
  }

  if (!current) {
    return <div className="p-6">Chargement…</div>;
  }

  const prompt = reverse ? current.definition : current.term;

  return (
    <div className="p-6 md:p-8 grid gap-4 max-w-2xl">
      <div className="text-sm text-[var(--muted)]">Question {i + 1} / {session.length}</div>
      <ProgressBar value={i} max={session.length - 1} />
      <div className="card p-5 text-xl font-medium">{prompt}</div>
      <div className="grid gap-2">
        {options.map((opt, idx) => (
          <OptionButton key={idx} label={opt.label} index={idx} onClick={() => choose(opt.correct)} />
        ))}
      </div>
      <FeedbackToast state={feedback} />
    </div>
  );
}
