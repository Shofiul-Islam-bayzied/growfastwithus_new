import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Search, Download, Eye, Mail, Phone, Building, Calendar, Filter, Users, TrendingUp } from "lucide-react";

interface Contact {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  company?: string;
  businessType?: string;
  currentSoftware?: string;
  painPoints?: string[];
  automationGoals?: string[];
  monthlyRevenue?: string;
  teamSize?: string;
  urgency?: string;
  budget?: string;
  createdAt: string;
}

export default function ContactsManager() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterUrgency, setFilterUrgency] = useState("all");
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);

  // Fetch contacts
  const { data: contacts = [], isLoading } = useQuery({
    queryKey: ["/api/contacts"],
  });

  // Filter contacts based on search and filters
  const filteredContacts = Array.isArray(contacts) ? contacts.filter((contact: Contact) => {
    const matchesSearch = !searchTerm || 
      contact.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.company?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = filterType === "all" || contact.businessType === filterType;
    const matchesUrgency = filterUrgency === "all" || contact.urgency === filterUrgency;

    return matchesSearch && matchesType && matchesUrgency;
  }) : [];

  // Delete contact mutation
  const deleteMutation = useMutation({
    mutationFn: (id: number) => apiRequest(`/api/contacts/${id}`, "DELETE"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/contacts"] });
      toast({ title: "Contact deleted successfully!" });
    },
    onError: () => {
      toast({ title: "Failed to delete contact", variant: "destructive" });
    },
  });

  const handleExportContacts = () => {
    const csvContent = [
      ["Name", "Email", "Phone", "Company", "Business Type", "Revenue", "Team Size", "Urgency", "Created"],
      ...filteredContacts.map((contact: Contact) => [
        `${contact.firstName} ${contact.lastName}`,
        contact.email,
        contact.phone || "",
        contact.company || "",
        contact.businessType || "",
        contact.monthlyRevenue || "",
        contact.teamSize || "",
        contact.urgency || "",
        new Date(contact.createdAt).toLocaleDateString()
      ])
    ].map(row => row.join(",")).join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `contacts-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    
    toast({ title: "Contacts exported successfully!" });
  };

  const getUrgencyColor = (urgency?: string) => {
    switch (urgency) {
      case "urgent": return "bg-red-500";
      case "high": return "bg-orange-500";
      case "medium": return "bg-yellow-500";
      case "low": return "bg-green-500";
      default: return "bg-gray-500";
    }
  };

  const getBusinessTypeStats = () => {
    const types: Record<string, number> = {};
    if (contacts && Array.isArray(contacts)) {
      contacts.forEach((contact: Contact) => {
        const type = contact.businessType || "Unknown";
        types[type] = (types[type] || 0) + 1;
      });
    }
    return Object.entries(types).map(([type, count]) => ({ type, count }));
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="text-white">Loading contacts...</div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Contacts Manager</h2>
          <p className="text-gray-400">Manage and analyze your leads and contacts</p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={handleExportContacts}
            variant="outline"
            className="text-white border-white/20 hover:bg-white/10"
          >
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-black/30 border-white/20">
          <CardContent className="p-4">
            <div className="flex items-center">
              <Users className="w-8 h-8 text-blue-400 mr-3" />
              <div>
                <p className="text-sm text-gray-400">Total Contacts</p>
                <p className="text-2xl font-bold text-white">{Array.isArray(contacts) ? contacts.length : 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-black/30 border-white/20">
          <CardContent className="p-4">
            <div className="flex items-center">
              <TrendingUp className="w-8 h-8 text-green-400 mr-3" />
              <div>
                <p className="text-sm text-gray-400">This Month</p>
                <p className="text-2xl font-bold text-white">
                  {Array.isArray(contacts) ? contacts.filter((c: Contact) => 
                    new Date(c.createdAt).getMonth() === new Date().getMonth()
                  ).length : 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-black/30 border-white/20">
          <CardContent className="p-4">
            <div className="flex items-center">
              <Mail className="w-8 h-8 text-orange-400 mr-3" />
              <div>
                <p className="text-sm text-gray-400">With Email</p>
                <p className="text-2xl font-bold text-white">
                  {Array.isArray(contacts) ? contacts.filter((c: Contact) => c.email).length : 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-black/30 border-white/20">
          <CardContent className="p-4">
            <div className="flex items-center">
              <Phone className="w-8 h-8 text-purple-400 mr-3" />
              <div>
                <p className="text-sm text-gray-400">With Phone</p>
                <p className="text-2xl font-bold text-white">
                  {Array.isArray(contacts) ? contacts.filter((c: Contact) => c.phone).length : 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="bg-black/30 border-white/20">
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search contacts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white/10 border-white/20 text-white"
                />
              </div>
            </div>
            
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-[180px] bg-white/10 border-white/20 text-white">
                <SelectValue placeholder="Business Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="ecommerce">E-commerce</SelectItem>
                <SelectItem value="saas">SaaS</SelectItem>
                <SelectItem value="consulting">Consulting</SelectItem>
                <SelectItem value="agency">Agency</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterUrgency} onValueChange={setFilterUrgency}>
              <SelectTrigger className="w-[150px] bg-white/10 border-white/20 text-white">
                <SelectValue placeholder="Urgency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Urgency</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>

            <Badge variant="outline" className="text-white border-white/20">
              {filteredContacts.length} of {Array.isArray(contacts) ? contacts.length : 0} contacts
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Contacts List */}
      <div className="space-y-4">
        {filteredContacts.length === 0 ? (
          <Card className="bg-black/30 border-white/20">
            <CardContent className="p-8 text-center">
              <Users className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-xl font-semibold text-white mb-2">No contacts found</h3>
              <p className="text-gray-400">
                {searchTerm || filterType !== "all" || filterUrgency !== "all"
                  ? "Try adjusting your search or filters"
                  : "Contacts will appear here as they submit the contact form"}
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredContacts.map((contact: Contact) => (
            <Card key={contact.id} className="bg-black/30 border-white/20 hover:bg-black/40 transition-colors">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-white text-lg">
                        {contact.firstName} {contact.lastName}
                      </h3>
                      {contact.urgency && (
                        <Badge className={`${getUrgencyColor(contact.urgency)} text-white`}>
                          {contact.urgency}
                        </Badge>
                      )}
                      {contact.businessType && (
                        <Badge variant="outline" className="text-white border-white/20">
                          {contact.businessType}
                        </Badge>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                      <div className="flex items-center text-gray-300">
                        <Mail className="w-4 h-4 mr-2" />
                        {contact.email}
                      </div>
                      {contact.phone && (
                        <div className="flex items-center text-gray-300">
                          <Phone className="w-4 h-4 mr-2" />
                          {contact.phone}
                        </div>
                      )}
                      {contact.company && (
                        <div className="flex items-center text-gray-300">
                          <Building className="w-4 h-4 mr-2" />
                          {contact.company}
                        </div>
                      )}
                      <div className="flex items-center text-gray-300">
                        <Calendar className="w-4 h-4 mr-2" />
                        {new Date(contact.createdAt).toLocaleDateString()}
                      </div>
                    </div>

                    {((contact.painPoints && contact.painPoints.length > 0) || (contact.automationGoals && contact.automationGoals.length > 0)) && (
                      <div className="mt-3 space-y-1">
                        {contact.painPoints && contact.painPoints.length > 0 && (
                          <p className="text-sm text-gray-400">
                            <span className="font-medium">Pain Points:</span> {contact.painPoints.slice(0, 2).join(", ")}
                            {contact.painPoints.length > 2 && "..."}
                          </p>
                        )}
                        {contact.automationGoals && contact.automationGoals.length > 0 && (
                          <p className="text-sm text-gray-400">
                            <span className="font-medium">Goals:</span> {contact.automationGoals.slice(0, 2).join(", ")}
                            {contact.automationGoals.length > 2 && "..."}
                          </p>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2 ml-4">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-white/20 text-white hover:bg-white/10"
                          onClick={() => setSelectedContact(contact)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="bg-gray-900 border-white/20 text-white max-w-2xl">
                        <DialogHeader>
                          <DialogTitle className="text-xl">
                            {contact.firstName} {contact.lastName}
                          </DialogTitle>
                        </DialogHeader>
                        
                        {selectedContact && (
                          <div className="space-y-6">
                            {/* Contact Info */}
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <h4 className="font-semibold mb-2 text-orange-400">Contact Information</h4>
                                <div className="space-y-2 text-sm">
                                  <p><span className="font-medium">Email:</span> {selectedContact.email}</p>
                                  {selectedContact.phone && (
                                    <p><span className="font-medium">Phone:</span> {selectedContact.phone}</p>
                                  )}
                                  {selectedContact.company && (
                                    <p><span className="font-medium">Company:</span> {selectedContact.company}</p>
                                  )}
                                  <p><span className="font-medium">Submitted:</span> {new Date(selectedContact.createdAt).toLocaleString()}</p>
                                </div>
                              </div>

                              <div>
                                <h4 className="font-semibold mb-2 text-orange-400">Business Details</h4>
                                <div className="space-y-2 text-sm">
                                  {selectedContact.businessType && (
                                    <p><span className="font-medium">Type:</span> {selectedContact.businessType}</p>
                                  )}
                                  {selectedContact.monthlyRevenue && (
                                    <p><span className="font-medium">Revenue:</span> {selectedContact.monthlyRevenue}</p>
                                  )}
                                  {selectedContact.teamSize && (
                                    <p><span className="font-medium">Team Size:</span> {selectedContact.teamSize}</p>
                                  )}
                                  {selectedContact.urgency && (
                                    <p><span className="font-medium">Urgency:</span> 
                                      <Badge className={`ml-2 ${getUrgencyColor(selectedContact.urgency)} text-white`}>
                                        {selectedContact.urgency}
                                      </Badge>
                                    </p>
                                  )}
                                </div>
                              </div>
                            </div>

                            {/* Pain Points */}
                            {selectedContact.painPoints && selectedContact.painPoints.length > 0 && (
                              <div>
                                <h4 className="font-semibold mb-2 text-orange-400">Pain Points</h4>
                                <div className="flex flex-wrap gap-2">
                                  {selectedContact.painPoints.map((point, index) => (
                                    <Badge key={index} variant="outline" className="border-red-400 text-red-400">
                                      {point}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Automation Goals */}
                            {selectedContact.automationGoals && selectedContact.automationGoals.length > 0 && (
                              <div>
                                <h4 className="font-semibold mb-2 text-orange-400">Automation Goals</h4>
                                <div className="flex flex-wrap gap-2">
                                  {selectedContact.automationGoals.map((goal, index) => (
                                    <Badge key={index} variant="outline" className="border-green-400 text-green-400">
                                      {goal}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Current Software */}
                            {selectedContact.currentSoftware && (
                              <div>
                                <h4 className="font-semibold mb-2 text-orange-400">Current Software</h4>
                                <p className="text-sm bg-black/30 p-3 rounded border border-white/10">
                                  {selectedContact.currentSoftware}
                                </p>
                              </div>
                            )}
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>

                    <Button
                      variant="outline"
                      size="sm"
                      className="border-white/20 text-white hover:bg-white/10"
                      onClick={() => window.open(`mailto:${contact.email}`, "_blank")}
                    >
                      <Mail className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}