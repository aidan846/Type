export async function getWords(amount: number): Promise<string[]> {
    const response = await fetch(`${import.meta.env.BASE_URL}words.txt`);
    const data = await response.text();
    const words = data.split(/\r?\n/).filter(word => word.trim() !== '');

    const currentWords: string[] = [];

    for(let i: number = 0; i < amount; i++) {
        const randomWord: string = words[Math.floor(Math.random() * words.length)];

        currentWords.push(randomWord);
    }
    
    return currentWords; 
}