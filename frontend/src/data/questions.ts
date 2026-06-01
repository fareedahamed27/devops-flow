import { Question } from '../types';

export const QUESTIONNAIRE_QUESTIONS: Question[] = [
  // Deep Communication Analysis with Indian Context
  {
    id: '1',
    text: 'When your partner shares something important with you, how often do you find yourself thinking about your response instead of truly listening?',
    type: 'scale',
    category: 'communication',
  },
  {
    id: '2',
    text: 'Describe a time when you felt completely misunderstood by your partner. What did you need from them that you didn\'t receive?',
    type: 'text',
    category: 'communication',
  },
  {
    id: '3',
    text: 'When discussing problems in your relationship, what pattern do you notice most?',
    type: 'multiple-choice',
    options: [
      'We both get defensive and nothing gets resolved',
      'One person dominates while the other shuts down',
      'We avoid the real issues and talk around them',
      'We blame each other instead of addressing the problem',
      'We actually listen and work toward solutions'
    ],
    category: 'communication',
  },
  {
    id: '4',
    text: 'What is the most difficult truth about yourself that you\'ve never shared with your partner?',
    type: 'text',
    category: 'communication',
  },
  {
    id: '5',
    text: 'How often do you say "I\'m fine" when you\'re actually not fine?',
    type: 'scale',
    category: 'communication',
  },

  // Family & Cultural Dynamics (Indian Context)
  {
    id: '6',
    text: 'How much do family opinions and expectations influence your relationship decisions?',
    type: 'scale',
    category: 'family',
  },
  {
    id: '7',
    text: 'Describe a situation where family pressure created tension in your relationship. How did you handle it?',
    type: 'text',
    category: 'family',
  },
  {
    id: '8',
    text: 'When there\'s a conflict between your partner\'s wishes and your family\'s expectations, what typically happens?',
    type: 'multiple-choice',
    options: [
      'I always side with my family',
      'I try to balance both but feel torn',
      'I support my partner but feel guilty',
      'I openly choose my partner over family',
      'We find a compromise that works for everyone'
    ],
    category: 'family',
  },
  {
    id: '9',
    text: 'How comfortable are you setting boundaries with family members regarding your relationship?',
    type: 'scale',
    category: 'family',
  },
  {
    id: '10',
    text: 'What family tradition or cultural expectation do you struggle with most in your relationship?',
    type: 'text',
    category: 'family',
  },

  // Emotional Vulnerability & Intimacy
  {
    id: '11',
    text: 'What emotion do you struggle most to express in your relationship?',
    type: 'multiple-choice',
    options: ['Anger', 'Sadness', 'Fear', 'Disappointment', 'Loneliness', 'Resentment', 'Joy'],
    category: 'emotional',
  },
  {
    id: '12',
    text: 'Describe your deepest fear about your relationship that keeps you awake at night.',
    type: 'text',
    category: 'emotional',
  },
  {
    id: '13',
    text: 'When you\'re emotionally hurt by your partner, how long does it typically take you to truly forgive (not just say you forgive)?',
    type: 'multiple-choice',
    options: ['Minutes to hours', 'A few days', 'Weeks', 'Months', 'I hold onto hurt for years', 'I never fully forgive'],
    category: 'emotional',
  },
  {
    id: '14',
    text: 'What part of yourself do you hide from your partner because you\'re afraid they won\'t love that side of you?',
    type: 'text',
    category: 'emotional',
  },
  {
    id: '15',
    text: 'How often do you feel emotionally lonely even when you\'re with your partner?',
    type: 'scale',
    category: 'emotional',
  },

  // Trust & Security
  {
    id: '16',
    text: 'If you discovered your partner had been hiding something significant (not necessarily cheating), how would you likely react?',
    type: 'multiple-choice',
    options: [
      'Feel betrayed and question everything',
      'Try to understand why they hid it',
      'Get angry and demand explanations',
      'Feel hurt but try to work through it',
      'Lose trust completely'
    ],
    category: 'trust',
  },
  {
    id: '17',
    text: 'What is something your partner does that makes you question their commitment to the relationship?',
    type: 'text',
    category: 'trust',
  },
  {
    id: '18',
    text: 'How secure do you feel in your relationship when your partner spends time with attractive people?',
    type: 'scale',
    category: 'trust',
  },
  {
    id: '19',
    text: 'What would be the hardest betrayal for you to forgive?',
    type: 'text',
    category: 'trust',
  },
  {
    id: '20',
    text: 'How often do you check your partner\'s phone, social media, or personal belongings?',
    type: 'multiple-choice',
    options: ['Never', 'Rarely', 'Sometimes when suspicious', 'Regularly', 'Constantly'],
    category: 'trust',
  },

  // Physical & Emotional Intimacy
  {
    id: '21',
    text: 'How satisfied are you with the emotional intimacy in your relationship (feeling truly known and understood)?',
    type: 'scale',
    category: 'intimacy',
  },
  {
    id: '22',
    text: 'What need do you have in your relationship that you feel embarrassed or uncomfortable asking for?',
    type: 'text',
    category: 'intimacy',
  },
  {
    id: '23',
    text: 'How often do you and your partner have meaningful conversations that go beyond daily logistics?',
    type: 'multiple-choice',
    options: ['Daily', 'Few times a week', 'Weekly', 'Monthly', 'Rarely', 'Never'],
    category: 'intimacy',
  },
  {
    id: '24',
    text: 'When was the last time you felt truly seen and appreciated by your partner? Describe that moment.',
    type: 'text',
    category: 'intimacy',
  },
  {
    id: '25',
    text: 'How comfortable are you being completely vulnerable and authentic with your partner?',
    type: 'scale',
    category: 'intimacy',
  },

  // Gender Roles & Expectations (Indian Context)
  {
    id: '26',
    text: 'How do traditional gender roles affect your relationship dynamics?',
    type: 'multiple-choice',
    options: [
      'We follow traditional roles and it works well',
      'We try to balance traditional and modern approaches',
      'We reject traditional roles completely',
      'It creates constant tension between us',
      'We\'re still figuring it out'
    ],
    category: 'gender_roles',
  },
  {
    id: '27',
    text: 'Describe a situation where societal expectations about your role (as a man/woman) created pressure in your relationship.',
    type: 'text',
    category: 'gender_roles',
  },
  {
    id: '28',
    text: 'How comfortable is your partner with you pursuing your career ambitions?',
    type: 'scale',
    category: 'gender_roles',
  },

  // Conflict & Resolution
  {
    id: '29',
    text: 'During arguments, what is your most destructive pattern?',
    type: 'multiple-choice',
    options: [
      'I shut down and withdraw',
      'I get aggressive and say hurtful things',
      'I bring up past issues',
      'I try to "win" instead of resolve',
      'I blame and criticize',
      'I threaten to leave'
    ],
    category: 'conflict',
  },
  {
    id: '30',
    text: 'What underlying issue causes most of your relationship conflicts that you never directly address?',
    type: 'text',
    category: 'conflict',
  },
  {
    id: '31',
    text: 'After a fight, how do you typically reconnect with your partner?',
    type: 'multiple-choice',
    options: [
      'We talk it through completely',
      'We pretend it never happened',
      'One person apologizes to end it',
      'We give each other space then slowly reconnect',
      'We don\'t really reconnect, just move on'
    ],
    category: 'conflict',
  },
  {
    id: '32',
    text: 'What do you wish your partner understood about how conflict affects you?',
    type: 'text',
    category: 'conflict',
  },
  {
    id: '33',
    text: 'How often do you feel like you\'re walking on eggshells to avoid conflict?',
    type: 'scale',
    category: 'conflict',
  },

  // Financial & Life Goals (Indian Context)
  {
    id: '34',
    text: 'How do you and your partner handle financial decisions and money management?',
    type: 'multiple-choice',
    options: [
      'One person controls all finances',
      'We discuss major purchases but handle day-to-day separately',
      'Everything is completely shared and discussed',
      'We often fight about money',
      'We avoid talking about money'
    ],
    category: 'financial',
  },
  {
    id: '35',
    text: 'What financial pressure or expectation (family support, lifestyle, etc.) creates the most stress in your relationship?',
    type: 'text',
    category: 'financial',
  },

  // Future & Commitment
  {
    id: '36',
    text: 'What is your biggest fear about the future of your relationship?',
    type: 'text',
    category: 'future',
  },
  {
    id: '37',
    text: 'If your relationship continues exactly as it is now for the next 10 years, how would you feel?',
    type: 'multiple-choice',
    options: [
      'Completely satisfied',
      'Mostly happy with some concerns',
      'Neutral - it\'s okay',
      'Disappointed and unfulfilled',
      'Trapped and miserable'
    ],
    category: 'future',
  },
  {
    id: '38',
    text: 'What would need to change in your relationship for you to feel completely fulfilled?',
    type: 'text',
    category: 'future',
  },
  {
    id: '39',
    text: 'How often do you fantasize about what life would be like with someone else?',
    type: 'scale',
    category: 'future',
  },
  {
    id: '40',
    text: 'If you could send a message to your partner that they would truly hear and understand, what would you say?',
    type: 'text',
    category: 'future',
  },
];