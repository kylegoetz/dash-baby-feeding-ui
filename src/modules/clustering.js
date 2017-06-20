export default class Cluster {
	constructor(items) {
		this.items = items;
	}

	createCluster(item) {
		return {
			min: new Date(item.createdAt),
			max: new Date(item.createdAt),
			range: 0,
			items: [item]
		};
	}

	isClusterRelevant(cluster, item) {
		const OFFSET = 60 * 60 * 1000;
		return cluster.min.getTime()-OFFSET <= item.createdAt.getTime() && cluster.max.getTime()+OFFSET >= item.createdAt.getTime();
	}

	updateCluster(cluster, newItem) {
		cluster.min = new Date(Math.min(cluster.min.getTime(), newItem.createdAt.getTime()));
		cluster.max = new Date(Math.max(cluster.max.getTime(), newItem.createdAt.getTime()));
		cluster.range = cluster.max.getTime() - cluster.min.getTime();
		cluster.items.push(newItem);
	}

	cluster() {
		const clicks = this.items;
		var clicksToCluster = [...clicks];
		clicksToCluster.sort((a, b) => {
			return new Date(a.createdAt) - new Date(b.createdAt);
		});
		const clusters = [];
		clicksToCluster.forEach(click => {
			const relevantCluster = clusters.find(cluster => this.isClusterRelevant(cluster, click));
			if(  relevantCluster  ) {
				this.updateCluster(relevantCluster, click);
			}
			else {
				clusters.push(this.createCluster(click));
			}
		});
		return clusters;
	}
}
