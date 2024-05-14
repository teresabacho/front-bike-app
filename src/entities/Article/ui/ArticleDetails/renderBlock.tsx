import { ArticleBlock } from '../../model/types/article';
import cls from './ArticleDetails.module.scss';
import { ArticleTextBlockComponent } from '../ArticleTextBlockComponent/ArticleTextBlockComponent';

export const renderArticleBlock = (block: ArticleBlock) => {

return(<ArticleTextBlockComponent
    key={block.id}
    className={cls.block}
    block={block}
/>)



};
