import { Link } from '@/routing/Link';

export function Pagination({ }){

    return <div className="join">
    <Link routeKey="홈" params={{ page: 1}} className="join-item btn">1</Link>
    <Link routeKey="홈" params={{ page: 2}} className="join-item btn aria-current-page:btn-active"
    
    aria-current="page">2</Link>
    <Link routeKey="홈" params={{ page: 3}} className="join-item btn">3</Link>
    <Link routeKey="홈" params={{ page: 4}} className="join-item btn">4</Link>
  </div>
}