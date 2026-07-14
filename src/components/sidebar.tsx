import { ExploreTopics } from "./explore-topic";
import { Newsletter } from "./newsletter";
import { TrendingNow } from "./trending-now";

export const Sidebar = () => {
	return (
		<aside className="lg:col-span-4">
			<div className="sticky top-24 space-y-10">
				<Newsletter />
				<TrendingNow />
				<ExploreTopics />
			</div>
		</aside>
	);
};
