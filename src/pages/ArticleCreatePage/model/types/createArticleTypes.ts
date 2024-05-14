
export type CreateArticleTypes = {
    isLoading: boolean;
    error?: string;
    title: string;
    blocks: Array<{
        title: string;
        paragraphs?: Array<string>;
    }>;
    img?: string
    file: File | null
}
