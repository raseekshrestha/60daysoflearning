
// data source
// https://gist.github.com/hiteshchoudhary/a80d86b50a5d9c591198a23d79e1e467

// Aggregation

// get active users
[
    {
        $match: {
            isActive: true,
        },
    },
    {
        $count: "activeUsers",
    },
]

//  output:  {activeUsers:516}


// group by gender
[
    {
        $group: {
            _id: "$gender"
        }
    }
]

// output : 
[{ _id: 'male' }, { _id: 'female' }]



// average age of each gender
[
    {
        $group: {
            _id: "$gender",
            averageAge: {
                $avg: "$age"
            }

        }
    }
]

//   output:
[
    { _id: 'male', averageAge: 29.851926977687626 },
    { _id: 'female', averageAge: 29.81854043392505 }
]



// group by favourite fruit
[
    {
        $group: {
            _id: "$favoriteFruit"
        }
    }
]
// output:
[{ _id: 'banana' }, { _id: 'apple' }, { _id: 'strawberry' }]


// group count and sort and limit the result
// group by favouriteFruit, count the total user based on fav fruit sort them and get top 2 result
// count -1 for descending 1 for ascending for field `count`
[
    {
        $group: {
            _id: "$favoriteFruit",
            count: {
                $sum: 1
            }
        }
    },
    {
        $sort: {
            count: -1
        }
    },
    {
        $limit: 2
    }
]

//   output
[
    { _id: 'banana', count: 339 },
    { _id: 'apple', count: 338 }
]



