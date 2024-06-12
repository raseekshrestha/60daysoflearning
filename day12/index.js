
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

// count : -1 ; for descending order higest one at top

// get the country with highest number of users
[
    {
        $group: {
            _id: "$company.location.country",
            countryUsersCount: {
                $sum: 1
            }

        },
    },
    {
        $sort: {
            countryUsersCount: -1
        }
    },
    {
        $limit: 1
    }
]
//   output:
[{ _id: "Germany", countryUsersCount: 261 }]


// list unique eye color
[
    {
        $group: {
            _id: "$eyeColor"

        }
    }
]
//   output
[{ _id: 'brown' }, { _id: 'green' }, { _id: 'blue' }]


// average number of tag per user

[
    {
        $unwind: {
            path: "$tags",

        }
    }, {
        $group: {
            _id: "$_id",
            tcount: {
                $sum: 1
            }
        }
    },
    {
        $group: {
            _id: null,
            averageNoOfTags: {
                $avg: "$tcount"
            }
        }
    }
]
// alternate way
// count total tags of users, group by null and get avg of tcount
[
    {
        $addFields: {
            tcount: {
                $size: "$tags"
            }
        }
    },
    {
        $group: {
            _id: null,
            tavg: {
                $avg: "$tcount"
            }
        }
    }
]
// if there is no tags in users gets tcount:0 from []
[
    {
        $addFields: {
            tcount: {
                $size: { $ifNull: ["$tags", []] }
            }
        }
    },
    {
        $group: {
            _id: null,
            tavg: {
                $avg: "$tcount"
            }
        }
    }
]

//   output:
[{ _id: null, averageNoOfTags: 3.586 }]
[{ _id: null, tavg: 3.556 }]



// how many user have 'enim' in their tags
// $match can search through array
[
    {
        $match: {
            tags: "enim"
        }
    },
    {
        $count: 'userWithEnim'
    }
]


// what are the name and age of user who are inactive and have 'velit' as a tag
[
    {
        $match: {
            isActive: false,
            tags: "velit",
            age: 20

        },
    },
    {
        $project: {
            name: 1,
            age: 1,
        },
    },
  ]
//   output
[
    {
        _id: ObjectId("66693b0584f7fbb82717857a"),
        name: 'Aurelia Gonzales',
        age: 20
    },
    {
        _id: ObjectId("66693b0584f7fbb827178640"),
        name: 'Obrien Tucker',
        age: 20
    },
    {
        _id: ObjectId("66693b0584f7fbb8271786fb"),
        name: 'Billie Lopez',
        age: 20
    }
]



// how many user have a phone number starting with '+1 (940)'
[
    {
        $match: {
            "company.phone": /^\+1 \(940\)/
        }
    },
    {
        $count: 'useWithcertainphonenumber'
    }
]
// output
[{ useWithcertainphonenumber: 5 }]



// most recent registered users top 3 and show name and fav fruit
[
    {
        $sort: {
            registered: -1,
        },
    },
    {
        $limit: 3,
    },
    {
        $project: {
            name: 1,
            favoriteFruit: 1,
        },
    }
]
//   output:
[
    {
        _id: ObjectId("66693b0584f7fbb82717883c"),
        name: 'Stephenson Griffith',
        favoriteFruit: 'apple'
    },
    {
        _id: ObjectId("66693b0584f7fbb82717872d"),
        name: 'Sonja Galloway',
        favoriteFruit: 'strawberry'
    },
    {
        _id: ObjectId("66693b0584f7fbb82717894e"),
        name: 'Mcpherson Christensen',
        favoriteFruit: 'strawberry'
    }
]



// list of user group by favoriteFruit
[
    {
        $group: {
            _id: "$favoriteFruit",
            users: {
                $push: "$name"
            }
        }
    }
]
//   output:
[
    { _id: 'banana', user: [array of usernames] },
    { _id: 'apple', user: [array of usernames] },
    { _id: 'strawberry', user: [array of usernames] },
]


// how many users have 'ad' as the second tag in their list of tags
// we can do tags.1 here 1 is the second position . starts from 0
[
    {
        $match: {
            "tags.1": "ad"
        }
    }
]
// output 
// uses with 'ad' at second position

[
    {
        $match: {
            "tags.1": "ad"
        }
    },
    {
        $count: "secondTagAd"
    }
]
// output
[{ secondTagAd: 12 }]


// users with 'emin' and 'ad' tag
[
    {
        $match: {
            tags: {
                $all: ['enim', 'id']
            }
        }
    }
]



// list all the companies locatin in the usa with their corresponding user count.
[
    {
        $match: {
            "company.location.country": "USA"
        }
    },
    {
        $group: {
            _id: "$company.location",
            userCount: {
                $sum: 1
            }
        }
    }
]


// lookup to join collecitons
[
    {
        $lookup: {
            from: "authors",
            localField: "author_id",
            foreignField: "_id",
            as: "author_details"
        }
    },
    {
        $addFields: {
            author_details: {
                $first: "$author_details"
            }
        }
    }

]

[
    {
        $lookup: {
            from: "authors",
            localField: "author_id",
            foreignField: "_id",
            as: "author_details"
        }
    },
    {
        $addFields: {
            author_details: {
                $arrayElemAt: ["$author_details", 0]
            }
        }
    },
    {
        $project: {
            author_id: 0
        }
    }

]