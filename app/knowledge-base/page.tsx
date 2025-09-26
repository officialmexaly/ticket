'use client'

import { useState, useEffect } from 'react'
import { FileText, Search, Plus, Book, Tag, Clock, Eye, ThumbsUp, Star } from 'lucide-react'

interface Article {
  id: string
  title: string
  content: string
  category: string
  tags: string[]
  created_at: string
  updated_at: string
  views: number
  helpful_votes: number
  author: string
}

export default function KnowledgeBasePage() {
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  const mockArticles: Article[] = [
    {
      id: '1',
      title: 'How to Create a New Ticket',
      content: 'Learn how to create and submit support tickets effectively...',
      category: 'Getting Started',
      tags: ['tickets', 'basics', 'tutorial'],
      created_at: '2024-01-15',
      updated_at: '2024-01-20',
      views: 245,
      helpful_votes: 18,
      author: 'Support Team'
    },
    {
      id: '2',
      title: 'Understanding Priority Levels',
      content: 'This guide explains the different priority levels and when to use them...',
      category: 'Support Process',
      tags: ['priority', 'process', 'guidelines'],
      created_at: '2024-01-10',
      updated_at: '2024-01-18',
      views: 189,
      helpful_votes: 24,
      author: 'John Admin'
    },
    {
      id: '3',
      title: 'Troubleshooting Common Issues',
      content: 'A comprehensive guide to resolving the most common technical issues...',
      category: 'Troubleshooting',
      tags: ['troubleshooting', 'common-issues', 'solutions'],
      created_at: '2024-01-08',
      updated_at: '2024-01-22',
      views: 312,
      helpful_votes: 42,
      author: 'Tech Team'
    },
    {
      id: '4',
      title: 'Account Settings and Profile Management',
      content: 'How to manage your account settings, update your profile...',
      category: 'Account',
      tags: ['account', 'settings', 'profile'],
      created_at: '2024-01-05',
      updated_at: '2024-01-15',
      views: 156,
      helpful_votes: 12,
      author: 'Support Team'
    },
    {
      id: '5',
      title: 'Best Practices for Writing Effective Tickets',
      content: 'Tips and guidelines for writing clear and effective support tickets...',
      category: 'Best Practices',
      tags: ['best-practices', 'writing', 'communication'],
      created_at: '2024-01-12',
      updated_at: '2024-01-25',
      views: 98,
      helpful_votes: 15,
      author: 'Support Team'
    }
  ]

  useEffect(() => {
    setArticles(mockArticles)
  }, [])

  const categories = ['all', ...Array.from(new Set(mockArticles.map(article => article.category)))]

  const filteredArticles = articles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         article.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         article.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesCategory = selectedCategory === 'all' || article.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const popularArticles = [...articles].sort((a, b) => b.views - a.views).slice(0, 5)
  const recentArticles = [...articles].sort((a, b) =>
    new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
  ).slice(0, 5)

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Knowledge Base</h1>
          <p className="text-gray-600">Find answers and learn about our system</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          <Plus className="w-4 h-4" />
          Add Article
        </button>
      </div>

      {/* Search and Filter */}
      <div className="flex items-center gap-4 p-4 bg-white rounded-lg border border-gray-200">
        <div className="flex-1 relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search articles, topics, or tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          {categories.map(category => (
            <option key={category} value={category}>
              {category === 'all' ? 'All Categories' : category}
            </option>
          ))}
        </select>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Articles</p>
              <p className="text-2xl font-bold text-gray-900">{articles.length}</p>
            </div>
            <FileText className="w-8 h-8 text-blue-500" />
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Categories</p>
              <p className="text-2xl font-bold text-gray-900">{categories.length - 1}</p>
            </div>
            <Book className="w-8 h-8 text-green-500" />
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Views</p>
              <p className="text-2xl font-bold text-gray-900">{articles.reduce((sum, article) => sum + article.views, 0)}</p>
            </div>
            <Eye className="w-8 h-8 text-purple-500" />
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Helpful Votes</p>
              <p className="text-2xl font-bold text-gray-900">{articles.reduce((sum, article) => sum + article.helpful_votes, 0)}</p>
            </div>
            <ThumbsUp className="w-8 h-8 text-orange-500" />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Articles List */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">
                Articles {searchQuery && `matching "${searchQuery}"`}
              </h2>
              <p className="text-sm text-gray-600">{filteredArticles.length} articles found</p>
            </div>
            <div className="divide-y divide-gray-200">
              {filteredArticles.map((article) => (
                <div key={article.id} className="p-6 hover:bg-gray-50 transition-colors cursor-pointer">
                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <FileText className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors">
                        {article.title}
                      </h3>
                      <p className="text-gray-600 mt-1 line-clamp-2">{article.content}</p>
                      <div className="flex items-center gap-4 mt-3">
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                          {article.category}
                        </span>
                        <div className="flex items-center gap-1 text-sm text-gray-500">
                          <Eye className="w-3 h-3" />
                          {article.views} views
                        </div>
                        <div className="flex items-center gap-1 text-sm text-gray-500">
                          <ThumbsUp className="w-3 h-3" />
                          {article.helpful_votes} helpful
                        </div>
                        <div className="flex items-center gap-1 text-sm text-gray-500">
                          <Clock className="w-3 h-3" />
                          {new Date(article.updated_at).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        {article.tags.map((tag) => (
                          <span key={tag} className="inline-flex items-center gap-1 px-2 py-1 text-xs rounded-md bg-gray-100 text-gray-600">
                            <Tag className="w-2 h-2" />
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {filteredArticles.length === 0 && (
                <div className="p-8 text-center">
                  <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No articles found</h3>
                  <p className="text-gray-600">Try adjusting your search terms or category filter</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Popular Articles */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-500" />
              Popular Articles
            </h3>
            <div className="space-y-3">
              {popularArticles.map((article, index) => (
                <div key={article.id} className="flex items-start gap-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer">
                  <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-semibold">
                    {index + 1}
                  </span>
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-gray-900 line-clamp-2">{article.title}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <Eye className="w-3 h-3" />
                        {article.views}
                      </div>
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <ThumbsUp className="w-3 h-3" />
                        {article.helpful_votes}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Articles */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-green-500" />
              Recently Updated
            </h3>
            <div className="space-y-3">
              {recentArticles.map((article) => (
                <div key={article.id} className="p-2 rounded-lg hover:bg-gray-50 cursor-pointer">
                  <h4 className="text-sm font-medium text-gray-900 line-clamp-2">{article.title}</h4>
                  <p className="text-xs text-gray-500 mt-1">
                    Updated {new Date(article.updated_at).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Categories */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Categories</h3>
            <div className="space-y-2">
              {categories.filter(cat => cat !== 'all').map((category) => {
                const count = articles.filter(article => article.category === category).length
                return (
                  <div
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition-colors ${
                      selectedCategory === category ? 'bg-blue-50 text-blue-700' : 'hover:bg-gray-50'
                    }`}
                  >
                    <span className="text-sm font-medium">{category}</span>
                    <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded-full">
                      {count}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}