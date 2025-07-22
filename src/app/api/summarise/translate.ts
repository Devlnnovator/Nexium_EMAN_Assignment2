export async function translateToUrdu(text: string): Promise<string> {
  const dictionary: Record<string, string> = {
    'the': 'دی',
    'blog': 'بلاگ',
    'summary': 'خلاصہ',
    'is': 'ہے',
    'this': 'یہ',
    'and': 'اور',
    'a': 'ایک',
    'of': 'کا'
  }

  return text
    .split(' ')
    .map(word => dictionary[word.toLowerCase()] || word)
    .join(' ')
}
