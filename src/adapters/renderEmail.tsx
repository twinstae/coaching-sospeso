import { Template, type TemplateProps } from '@/shared/email/SecretLink';
import { render } from 'jsx-email';

export function renderSecretLinkEmail(props: TemplateProps){
    return render(<Template {...props}/>)
}